import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ElementRef,
  ViewChild,
  DoCheck,
  Directive,
  ChangeDetectorRef
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { Observable, Subscription, of } from 'rxjs';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import {
  AssigneeDetails,
  History,
  HistoryResponse,
  SelectedAssignee,
  UpdateIssueOrActionEvent,
  UserDetails
} from 'src/app/interfaces';
import { UsersService } from 'src/app/components/user-management/services/users.service';
import { ObservationsService } from '../../services/observations.service';
import { LoginService } from 'src/app/components/login/services/login.service';
import { TenantService } from 'src/app/components/tenant-management/services/tenant.service';
import { Amplify } from 'aws-amplify';
import { tap } from 'rxjs/operators';
import { SlideshowComponent } from 'src/app/shared/components/slideshow/slideshow.component';
import { format } from 'date-fns';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ToastService } from 'src/app/shared/toast';

@Directive({
  selector: '[appScrollToBottom]'
})
export class ScrollToBottomDirective {
  constructor(private el: ElementRef) {}
  public scrollToBottom() {
    const el: HTMLDivElement = this.el.nativeElement;
    el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight);
  }
}

@Component({
  selector: 'app-issues-actions-view',
  templateUrl: './issues-actions-view.component.html',
  styleUrls: ['./issues-actions-view.component.scss']
})
export class IssuesActionsViewComponent implements OnInit, OnDestroy, DoCheck {
  @ViewChild(ScrollToBottomDirective)
  scroll: ScrollToBottomDirective;
  @ViewChild('footer') footer: ElementRef;
  issuesActionsDetailViewForm: FormGroup = this.fb.group({
    title: '',
    description: '',
    category: '',
    round: '',
    plant: '',
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
  isPreviousEnabled = false;
  isNextEnabled = false;
  ghostLoading = new Array(17).fill(0).map((_, i) => i);
  placeholder = '_ _';
  moduleName: string;
  private totalCount = 0;
  private allData = [];
  private amplifySubscription$: Subscription = null;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<IssuesActionsViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private observations: ObservationsService,
    private loginService: LoginService,
    private userService: UsersService,
    private sanitizer: DomSanitizer,
    private tenantService: TenantService,
    private dialog: MatDialog,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  getAttachmentsList() {
    return (this.issuesActionsDetailViewForm.get('attachments') as FormArray)
      .controls;
  }

  ngOnInit(): void {
    const { users$, totalCount$, allData, moduleName } = this.data;
    this.allData = allData;
    this.moduleName = moduleName;
    totalCount$?.subscribe((count: number) => (this.totalCount = count || 0));
    const {
      s3Details: { bucket, region },
      tenantId
    } = this.tenantService.getTenantInfo();
    this.s3BaseUrl = `https://${bucket}.s3.${region}.amazonaws.com/`;
    this.userInfo = this.loginService.getLoggedInUserInfo();
    this.users$ = users$.pipe(
      tap((users: UserDetails[]) => (this.assigneeDetails = { users }))
    );
    this.init();
    if (tenantId) {
      this.tenantService
        .getTenantAmplifyConfigByTenantId$(tenantId)
        .subscribe(({ amplifyConfig }) => {
          if (Object.keys(amplifyConfig).length > 0) {
            // 1. Configure amplify
            Amplify.configure(amplifyConfig);

            // 2. Create issue history subscription
            this.amplifySubscription$ = this.observations
              .onCreateIssuesLogHistory$({
                issueslistID: {
                  eq: this.data.id
                },
                moduleName: {
                  eq: this.moduleName
                }
              })
              ?.subscribe({
                next: ({
                  _,
                  value: {
                    data: { onCreateIssuesLogHistory }
                  }
                }) => {
                  if (onCreateIssuesLogHistory) {
                    this.prepareSubscriptionResponse(onCreateIssuesLogHistory);
                  }
                }
              });

            // 3. Create actions log history
            this.amplifySubscription$ = this.observations
              .onCreateActionsLogHistory$({
                actionslistID: {
                  eq: this.data.id
                },
                moduleName: {
                  eq: this.moduleName
                }
              })
              ?.subscribe({
                next: ({
                  _,
                  value: {
                    data: { onCreateActionsLogHistory }
                  }
                }) => {
                  if (onCreateActionsLogHistory) {
                    this.prepareSubscriptionResponse(onCreateActionsLogHistory);
                  }
                }
              });

            // 4. Update actions log history
            this.amplifySubscription$ = this.observations
              .onUpdateActionsList$({
                id: { eq: this.data.id },
                moduleName: {
                  eq: this.moduleName
                }
              })
              ?.subscribe({
                next: ({
                  _,
                  value: {
                    data: { onUpdateActionsList }
                  }
                }) => {
                  if (onUpdateActionsList) {
                    this.initOnUpdateList(onUpdateActionsList, 'actionData');
                  }
                }
              });

            // 5. Update issues log history
            this.amplifySubscription$ = this.observations
              .onUpdateIssuesList$({
                id: { eq: this.data.id },
                moduleName: {
                  eq: this.moduleName
                }
              })
              ?.subscribe({
                next: ({
                  _,
                  value: {
                    data: { onUpdateIssuesList }
                  }
                }) => {
                  if (onUpdateIssuesList) {
                    this.initOnUpdateList(onUpdateIssuesList, 'issueData');
                  }
                }
              });
          }
        });
    }
  }

  ngDoCheck() {
    const height = this.footer?.nativeElement.offsetHeight;
    this.chatPanelHeight = `calc(100vh - ${height + 105}px)`;
    this.cdRef.detectChanges();
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
        .uploadIssueOrActionLogHistoryAttachment$(
          id,
          attachmentsForm,
          type,
          this.moduleName
        )
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
    this.observations.getObservationChartCounts$(this.moduleName).subscribe();
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
        type,
        this.moduleName
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

  createNotification() {
    if (this.data.category !== this.placeholder) {
      this.observations
        .createNotification(this.data, this.moduleName)
        .subscribe((value) => {
          if (Object.keys(value).length) {
            const { notificationInfo } = value;
            this.data.notificationInfo = notificationInfo;
          }
        });
    } else {
      this.toastService.show({
        type: 'warning',
        text: 'Category is mandatory for notification creation'
      });
    }
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
        type,
        this.moduleName
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
      slideshowImages.push(this.getS3Url(media.message));
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

  onPrevious(): void {
    const { id } = this.data;
    const idx = this.allData?.findIndex((a) => a?.id === id);
    if (idx === -1) {
      this.isPreviousEnabled = false;
      return;
    }
    const previousRecord = this.allData[idx - 1];
    if (!previousRecord) {
      this.isPreviousEnabled = false;
      return;
    } else {
      const currentIdx = this.allData?.findIndex(
        (a) => a?.id === previousRecord?.id
      );
      this.isPreviousEnabled = false;
      if (currentIdx !== -1 && this.allData[currentIdx - 1]) {
        this.isPreviousEnabled = true;
      }
      this.data = {
        allData: this.allData,
        next: this.data?.next,
        totalCount$: this.data?.totalCount$,
        users$: this.data?.users$,
        limit: this.data?.limit,
        ...previousRecord
      };
      this.init();
    }
  }

  onNext(): void {
    const { id } = this.data;
    const idx = this.allData?.findIndex((a) => a?.id === id);
    if (idx === -1) {
      this.isPreviousEnabled = false;
      return;
    }
    const nextRecord = this.allData[idx + 1];
    if (!nextRecord) {
      if (this.data?.next === null) {
        this.isPreviousEnabled = false;
        if (idx !== -1 && this.allData[idx - 1]) {
          this.isPreviousEnabled = true;
        }
        this.isNextEnabled = false;
        return;
      }
      this.getIssuesActionsList(this.data);
      this.isPreviousEnabled = true;
    } else {
      const currentIdx = this.allData?.findIndex(
        (a) => a?.id === nextRecord?.id
      );
      this.isPreviousEnabled = true;
      this.isNextEnabled = false;
      if (currentIdx !== -1 && this.allData[currentIdx + 1]) {
        this.isNextEnabled = true;
      }
      this.data = {
        allData: this.allData,
        next: this.data?.next,
        totalCount$: this.data?.totalCount$,
        users$: this.data?.users$,
        limit: this.data?.limit,
        ...nextRecord
      };
      this.init();
    }
  }

  ngOnDestroy(): void {
    if (this.amplifySubscription$) this.amplifySubscription$?.unsubscribe();
  }

  private getIssuesActionsList(data): void {
    let observable: Observable<{ count: number; next: string; rows: any[] }>;
    if (data?.type === 'issue') {
      this.observations.issuesNextToken = data.next;
      this.observations.fetchIssues$.next({
        data: 'infiniteScroll'
      });
      observable = this.observations.issues$;
    } else {
      this.observations.actionsNextToken = data.next;
      this.observations.fetchActions$.next({
        data: 'infiniteScroll'
      });
      observable = this.observations.actions$;
    }

    observable?.pipe().subscribe(({ count, next: _next, rows }) => {
      this.totalCount = count;
      this.allData = [...this.allData, ...rows];
      const idx = this.allData?.findIndex((a) => a?.id === data?.id);
      if (idx === -1) {
        return;
      }
      const nextRecordIdx = idx + 1;
      const nextRecord = this.allData[nextRecordIdx];
      if (!nextRecord) {
        return;
      } else {
        this.observations.issuesNextToken = _next;
        this.data = {
          allData: this.allData,
          next: _next,
          totalCount$: data?.totalCount$,
          users$: data?.users$,
          limit: data?.limit,
          ...nextRecord
        };
        this.init();
      }
    });
  }

  private init(): void {
    const { id, type, dueDate, notificationInfo } = this.data;
    const idx = this.allData?.findIndex((a) => a?.id === id);
    if (idx === -1) {
      this.isPreviousEnabled = false;
      this.isNextEnabled = false;
    } else {
      if (this.allData[idx - 1]) this.isPreviousEnabled = true;
      if (this.allData[idx + 1]) this.isNextEnabled = true;
    }
    if (this.data.next !== null) {
      this.isNextEnabled = true;
    }
    this.data.notificationInfo =
      notificationInfo !== this.placeholder ? notificationInfo : '';
    this.issuesActionsDetailViewForm.patchValue({
      ...this.data,
      dueDate: dueDate ? new Date(dueDate) : '',
      dueDateDisplayValue: dueDate
        ? format(new Date(dueDate), 'dd MMM yyyy')
        : ''
    });
    this.minDate = new Date(this.data.createdAt);
    this.logHistory$ = this.observations
      .getIssueOrActionLogHistory$(id, type, {}, this.moduleName)
      .pipe(
        tap((logHistory) => {
          this.logHistory = logHistory.rows;
          this.filteredMediaType = this.logHistory.filter(
            (history) => history.type === 'Media'
          );
        })
      );
  }

  private prepareSubscriptionResponse(data) {
    this.logHistory = [
      ...this.logHistory,
      {
        ...data,
        createdAt: format(new Date(data?.createdAt), 'dd MMM yyyy, hh:mm a'),
        message:
          data.type === 'Object' ? JSON.parse(data?.message) : data?.message
      }
    ];
    this.filteredMediaType = this.logHistory.filter(
      (history) => history?.type === 'Media'
    );
    this.logHistory$ = of({
      nextToken: null,
      rows: this.logHistory
    });
  }

  private initJSONData(data = null) {
    const obj = {};
    data = JSON.parse(data) ?? {};
    data?.FORMS.forEach((form) => {
      form?.PAGES.forEach((page) => {
        page?.SECTIONS.forEach((section) => {
          section?.FIELDS.forEach((field) => {
            obj[field.FIELDNAME] = field.FIELDVALUE;
          });
        });
      });
    });
    return obj;
  }

  private initOnUpdateList(data, key) {
    if (data) {
      const idx = this.data?.allData?.findIndex((d) => d?.id === data?.id);
      if (idx !== -1) {
        const jsonData: any = this.initJSONData(data[key]);
        if (this.data?.id === data?.id) {
          this.data = {
            ...this.data,
            ...data,
            ...jsonData,
            dueDate: jsonData?.DUEDATE
              ? format(new Date(jsonData?.DUEDATE), 'dd MMM, yyyy')
              : '',
            priority: jsonData.PRIORITY ?? '',
            statusDisplay: this.observations.prepareStatus(
              jsonData.STATUS ?? ''
            ),
            status: jsonData?.STATUS ?? ''
          };
          this.allData[idx] = this.data;
        }
      }
    }
  }
}