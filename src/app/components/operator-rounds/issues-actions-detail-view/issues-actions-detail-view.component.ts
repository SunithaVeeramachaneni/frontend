import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ElementRef,
  ViewChild,
  DoCheck
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  AssigneeDetails,
  History,
  HistoryResponse,
  SelectedAssignee,
  UpdateIssueOrActionEvent,
  UserDetails
} from 'src/app/interfaces';
import { UsersService } from '../../user-management/services/users.service';
import { RoundPlanObservationsService } from '../services/round-plan-observation.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginService } from '../../login/services/login.service';
import { TenantService } from '../../tenant-management/services/tenant.service';
import { SlideshowComponent } from 'src/app/shared/components/slideshow/slideshow.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-issues-actions-detail-view',
  templateUrl: './issues-actions-detail-view.component.html',
  styleUrls: ['./issues-actions-detail-view.component.scss']
})
export class IssuesActionsDetailViewComponent
  implements OnInit, OnDestroy, DoCheck
{
  @ViewChild('footer') footer: ElementRef;
  issuesActionsDetailViewForm: FormGroup = this.fb.group({
    title: '',
    description: '',
    category: '',
    round: '',
    location: '',
    asset: '',
    task: '',
    priority: '',
    status: '',
    dueDateDisplayValue: '',
    dueDate: '',
    assignedToDisplay: '',
    assignedTo: '',
    raisedBy: '',
    attachments: this.fb.array([]),
    message: ''
  });
  priorities = ['Emergency', 'High', 'Medium', 'Low', 'Shutdown'];
  statuses = ['Open', 'In-Progress', 'Resolved'];
  statusValues = ['Open', 'In Progress', 'Resolved'];
  minDate: Date;
  users$: Observable<UserDetails[]>;
  logHistory$: Observable<HistoryResponse>;
  assigneeDetails: AssigneeDetails;
  updatingDetails = false;
  userInfo: any;
  s3BaseUrl: string;
  logHistory: History[];
  filteredMediaType: any;
  chatPanelHeight;
  placeHolder = '_ _';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<IssuesActionsDetailViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private observations: RoundPlanObservationsService,
    private loginService: LoginService,
    private userService: UsersService,
    private sanitizer: DomSanitizer,
    private tenantService: TenantService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  getAttachmentsList() {
    return (this.issuesActionsDetailViewForm.get('attachments') as FormArray)
      .controls;
  }

  ngOnInit(): void {
    const { id, type, users$, dueDate } = this.data;
    if (type === 'issue') {
      this.issuesActionsDetailViewForm.get('priority').disable();
    }
    const {
      s3Details: { bucket, region }
    } = this.tenantService.getTenantInfo();
    this.s3BaseUrl = `https://${bucket}.s3.${region}.amazonaws.com/`;
    this.userInfo = this.loginService.getLoggedInUserInfo();
    this.users$ = users$.pipe(
      tap((users: UserDetails[]) => (this.assigneeDetails = { users }))
    );
    this.issuesActionsDetailViewForm.patchValue({
      ...this.data,
      dueDate: dueDate ? new Date(dueDate) : '',
      dueDateDisplayValue: dueDate
        ? format(new Date(dueDate), 'dd MMM yyyy')
        : ''
    });
    this.minDate = new Date(this.data.createdAt);
    this.logHistory$ = this.observations
      .getIssueOrActionLogHistory$(id, type, {})
      .pipe(
        tap((logHistory) => {
          this.logHistory = logHistory.rows;
          this.filteredMediaType = this.logHistory.filter(
            (history) => history.type === 'Media'
          );
        })
      );
    this.observations
      .onCreateIssueOrActionLogHistoryEventSource(
        `${type}/${id}/log-history/sse`
      )
      .subscribe();
  }

  ngDoCheck() {
    const height = this.footer?.nativeElement.offsetHeight;
    this.chatPanelHeight = `calc(100vh - ${height + 105}px)`;
  }

  getImageSrc = (source: string) => {
    if (source) {
      const base64Image = 'data:image/jpeg;base64,' + source;
      return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
    }
  };

  uploadFile(event): void {
    const { files } = event.target as HTMLInputElement;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadend = () => {
      const attachmentsForm = new FormData();
      attachmentsForm.append('file', files[0]);
      const { id, type } = this.data;

      this.observations
        .uploadIssueOrActionLogHistoryAttachment$(id, attachmentsForm, type)
        .pipe(
          tap((resp) => {
            if (Object.keys(resp).length) {
              this.filteredMediaType.push(resp);
              this.issuesActionsDetailViewForm.markAsDirty();
            }
          })
        )
        .subscribe();
    };
  }

  updateDate(
    event: MatDatepickerInputEvent<Date>,
    formControlDateField: string
  ) {
    this.issuesActionsDetailViewForm.patchValue({
      [formControlDateField]: format(event.value, 'dd MMM yyyy')
    });
    this.updateIssueOrAction({
      field: 'dueDate',
      value: new Date(event.value).toISOString()
    });
    this.issuesActionsDetailViewForm.markAsDirty();
  }

  onCancel(): void {
    this.dialogRef.close({
      data: { ...this.issuesActionsDetailViewForm.value, id: this.data.id }
    });
  }

  updateIssueOrAction(event: UpdateIssueOrActionEvent) {
    const { id, type, issueData, actionData, issueOrActionDBVersion } =
      this.data;
    const { field, value, checked } = event;
    const updatedIssueData = this.updateIssueOrActionData(
      issueData,
      {
        [field]: value
      },
      checked
    );
    const updatedActionData = this.updateIssueOrActionData(
      actionData,
      {
        [field]: value
      },
      checked
    );
    if (type === 'issue') {
      this.data.issueData = updatedIssueData;
    } else {
      this.data.actionData = updatedActionData;
    }
    this.updatingDetails = true;
    this.observations
      .updateIssueOrAction$(
        id,
        {
          id,
          issueData: updatedIssueData,
          actionData: updatedActionData,
          assignedTo: this.issuesActionsDetailViewForm.get('assignedTo').value,
          issueOrActionDBVersion,
          history: {
            type: 'Object',
            message: JSON.stringify({
              [field.toUpperCase()]: value,
              assignmentType: checked ? 'add' : 'remove'
            })
          }
        },
        type
      )
      .pipe(
        tap((response) => {
          if (Object.keys(response).length) {
            this.data.issueOrActionDBVersion += 1;
          }
          this.updatingDetails = false;
        })
      )
      .subscribe();
  }

  updateIssueOrActionData(
    data: any = null,
    fieldInfo: any,
    checked: boolean = true
  ) {
    if (data === null) {
      return null;
    }
    // Handling this logic in UI, Because in case of update we will get 204 No Content from REST. In case of multiple updates, everytime we need fetch call and then update the data
    const { status, priority, dueDate, assignee } = fieldInfo;
    data = JSON.parse(data);
    data.FORMS.forEach((form) => {
      form.PAGES.forEach((page) => {
        page.SECTIONS.forEach((section) => {
          section.FIELDS.forEach((field) => {
            if (status && field.FIELDNAME === 'STATUS') {
              field.FIELDVALUE = status;
            } else if (priority && field.FIELDNAME === 'PRIORITY') {
              field.FIELDVALUE = priority;
            } else if (dueDate && field.FIELDNAME === 'DUEDATE') {
              field.FIELDVALUE = dueDate;
            } else if (assignee && field.FIELDNAME === 'ASSIGNEE') {
              const index = field.FIELDDESC.split(',').findIndex(
                (email: string) => email === assignee
              );
              if (checked === false) {
                field.FIELDVALUE = field.FIELDVALUE.split(',');
                field.FIELDVALUE.splice(index, 1);
                field.FIELDVALUE = field.FIELDVALUE.join(',');
                field.FIELDDESC = field.FIELDDESC.split(',');
                field.FIELDDESC.splice(index, 1);
                field.FIELDDESC = field.FIELDDESC.join(',');
              } else if (index === -1) {
                field.FIELDVALUE += `${
                  field.FIELDVALUE
                    ? `,${this.userService.getUserFullName(assignee)}`
                    : `${this.userService.getUserFullName(assignee)}`
                } `;
                field.FIELDDESC += `${
                  field.FIELDDESC ? `,${assignee}` : `${assignee}`
                }`;
              }
              this.issuesActionsDetailViewForm.patchValue({
                assignedToDisplay: this.observations.formatUsersDisplay(
                  field.FIELDDESC
                )
              });
              this.issuesActionsDetailViewForm.patchValue({
                assignedTo: field.FIELDDESC
              });
            }
          });
        });
      });
    });
    return JSON.stringify(data);
  }

  selectedAssigneeHandler({ user, checked }: SelectedAssignee) {
    this.updateIssueOrAction({ field: 'assignee', value: user.email, checked });
  }

  createIssueOrActionHistory() {
    const message = this.issuesActionsDetailViewForm.get('message').value;
    if (!message.trim()) {
      return;
    }
    const { id, type } = this.data;
    this.observations
      .createIssueOrActionLogHistory$(
        id,
        {
          type: 'Message',
          message
        },
        type
      )
      .pipe(
        tap((history) => {
          if (Object.keys(history).length) {
            this.issuesActionsDetailViewForm.patchValue({ message: '' });
          }
        })
      )
      .subscribe();
  }

  resetFile(event: Event) {
    const file = event.target as HTMLInputElement;
    file.value = '';
  }

  getS3Url(filePath: string) {
    return `${this.s3BaseUrl}public/${filePath}`;
  }

  navigateToRounds() {
    this.dialogRef.close();
    this.router.navigate(['/operator-rounds/scheduler/1']);
  }

  openPreviewDialog() {
    const slideshowImages = [];
    this.filteredMediaType.forEach((media) => {
      slideshowImages.push(this.s3BaseUrl + media.message);
    });
    if (slideshowImages) {
      this.dialog.open(SlideshowComponent, {
        width: '100%',
        height: '100%',
        panelClass: 'slideshow-container',
        backdropClass: 'slideshow-backdrop',
        data: slideshowImages
      });
    }
  }

  getUserNameByEmail(email) {
    return this.userService.getUserFullName(email);
  }

  ngOnDestroy(): void {
    this.observations.closeOnCreateIssueOrActionLogHistoryEventSourceEventSource();
  }
}
