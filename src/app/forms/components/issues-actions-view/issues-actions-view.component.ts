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
import { format, isToday, isYesterday, parse, parseISO } from 'date-fns';
import { ToastService } from 'src/app/shared/toast';
import { MatDatetimePickerInputEvent } from '@angular-material-components/datetime-picker/public-api';
import { PlantService } from 'src/app/components/master-configurations/plants/services/plant.service';
import {
  getTimezoneUTC,
  localToTimezoneDate
} from 'src/app/shared/utils/timezoneDate';
import { dateTimeFormat2, dateFormat2 } from 'src/app/app.constants';

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
    plantId: '',
    attachments: this.fb.array([]),
    message: ''
  });
  priorities = ['Emergency', 'High', 'Medium', 'Low', 'Shutdown', 'Turnaround'];
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
  filteredMediaType: any[] = [];
  chatPanelHeight;
  isPreviousEnabled = false;
  isNextEnabled = false;
  ghostLoading = new Array(17).fill(0).map((_, i) => i);
  placeholder = '_ _';
  isCreateNotification = false;
  moduleName: string;
  plantTimezoneMap: any;
  plantMapSubscription: Subscription;
  private totalCount = 0;
  private allData = [];
  private amplifySubscription$: Subscription[] = [];
  private attachmentsSubscriptionData = [];

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
    private toastService: ToastService,
    private plantService: PlantService
  ) {}

  getAttachmentsList() {
    return (this.issuesActionsDetailViewForm.get('attachments') as FormArray)
      .controls;
  }

  ngOnInit(): void {
    this.plantMapSubscription =
      this.plantService.plantTimeZoneMapping$.subscribe(
        (data) => (this.plantTimezoneMap = data)
      );
    const { users$, totalCount$, allData, notificationInfo, moduleName } =
      this.data;
    this.allData = allData;

    this.moduleName = moduleName;
    totalCount$?.subscribe((count: number) => (this.totalCount = count || 0));
    const {
      s3Details: { bucket, region },
      tenantId
    } = this.tenantService.getTenantInfo();
    this.data.notificationInfo = this.isNotificationNumber(notificationInfo)
      ? notificationInfo
      : '';

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
            const onCreateIssuesLogHistory$ = this.observations
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
            if (onCreateIssuesLogHistory$) {
              this.amplifySubscription$.push(onCreateIssuesLogHistory$);
            }

            // 3. Create actions log history
            const onCreateActionsLogHistory$ = this.observations
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

            if (onCreateActionsLogHistory$) {
              this.amplifySubscription$.push(onCreateActionsLogHistory$);
            }

            // 4. Update actions log history
            const onUpdateActionsList$ = this.observations
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

            if (onUpdateActionsList$) {
              this.amplifySubscription$.push(onUpdateActionsList$);
            }

            // 5. Update issues log history
            const onUpdateIssuesList$ = this.observations
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
            if (onUpdateIssuesList$) {
              this.amplifySubscription$.push(onUpdateIssuesList$);
            }

            // 6. Create issue attachments issues log history
            const onCreateIssuesAttachments$ = this.observations
              .onCreateIssuesAttachments$({
                objectId: this.data.id
              })
              ?.subscribe({
                next: ({
                  _,
                  value: {
                    data: { onCreateIssuesAttachments }
                  }
                }) => {
                  if (onCreateIssuesAttachments) {
                    const base64Image =
                      'data:image/jpeg;base64,' +
                      onCreateIssuesAttachments?.imageData;
                    this.attachmentsSubscriptionData.push({
                      objectId: onCreateIssuesAttachments?.objectId,
                      imageData: base64Image,
                      id: onCreateIssuesAttachments?.id
                    });
                  }
                }
              });

            if (onCreateIssuesAttachments$) {
              this.amplifySubscription$.push(onCreateIssuesAttachments$);
            }

            // 7. Create action attachments action log history
            const onCreateActionsAttachments$ = this.observations
              .onCreateActionsAttachments$({
                objectId: this.data.id
              })
              ?.subscribe({
                next: ({
                  _,
                  value: {
                    data: { onCreateActionsAttachments }
                  }
                }) => {
                  if (onCreateActionsAttachments) {
                    const base64Image =
                      'data:image/jpeg;base64,' +
                      onCreateActionsAttachments?.imageData;
                    this.attachmentsSubscriptionData.push({
                      objectId: onCreateActionsAttachments?.objectId,
                      imageData: base64Image,
                      id: onCreateActionsAttachments?.id
                    });
                  }
                }
              });

            if (onCreateActionsAttachments$) {
              this.amplifySubscription$.push(onCreateActionsAttachments$);
            }
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

  isNotificationNumber(notificationInfo) {
    if (
      !notificationInfo ||
      notificationInfo.split(' ').length > 1 ||
      notificationInfo === this.placeholder
    ) {
      return false;
    }
    return true;
  }

  uploadFile(event): void {
    const { files } = event.target as HTMLInputElement;
    const reader = new FileReader();
    const file: File = files[0];
    const size = file.size;
    const maxSize = 400000;
    if (size > maxSize) {
      this.toastService.show({
        type: 'warning',
        text: 'Please select file less than 400KB'
      });
      return;
    }
    reader.readAsDataURL(files[0]);
    reader.onloadend = () => {
      const { id, type } = this.data;
      const base64result = (reader?.result as string)?.split(';base64,')[1];
      this.observations
        .uploadIssueOrActionLogHistoryAttachment$(
          id,
          { file: base64result },
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
    event: MatDatetimePickerInputEvent<Date>,
    formControlDateField: string
  ) {
    if (
      this.plantTimezoneMap[
        this.issuesActionsDetailViewForm.get('plantId').value
      ]?.timeZoneIdentifier
    ) {
      this.updateIssueOrAction({
        field: 'dueDate',
        value: getTimezoneUTC(
          event.value,
          this.plantTimezoneMap[
            this.issuesActionsDetailViewForm.get('plantId').value
          ]
        )
      });
    } else {
      this.updateIssueOrAction({
        field: 'dueDate',
        value: new Date(event.value).toISOString()
      });
    }
    this.issuesActionsDetailViewForm.patchValue({
      [formControlDateField]: format(event.value, dateTimeFormat2)
    });
    this.issuesActionsDetailViewForm.markAsDirty();
  }

  onCancel(): void {
    this.observations
      .getObservationChartCounts$(this.moduleName)
      .subscribe(() => {
        this.dialogRef.close({
          data: {
            ...this.issuesActionsDetailViewForm.value,
            id: this.data.id,
            priority: this.data.priority,
            notificationInfo: this.data.notificationInfo
          }
        });
      });
  }

  updateIssueOrAction(event: UpdateIssueOrActionEvent) {
    const { id, type, issueData, actionData, issueOrActionDBVersion } =
      this.data;
    const { field, value, checked } = event;
    let { previouslyAssignedTo = '' } = this.data;

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
    if (field === 'assignee') {
      if (checked && previouslyAssignedTo?.includes(value)) {
        previouslyAssignedTo = previouslyAssignedTo
          .split(',')
          .filter((email) => email !== value)
          .join(',');
      }

      if (!checked) {
        previouslyAssignedTo += previouslyAssignedTo ? `,${value}` : value;
      }
    }

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
          previouslyAssignedTo,
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
            Object.assign(this.data, { previouslyAssignedTo });
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
                assignedTo: field.FIELDDESC,
                assignedToDisplay: this.observations.formatUsersDisplay(
                  field.FIELDDESC
                )
              });
            }
          });
        });
      });
    });
    return JSON.stringify(data);
  }

  createNotification() {
    this.isCreateNotification = true;
    if (this.data.category !== this.placeholder) {
      const { allData, ...rest } = this.data;
      this.observations
        .createNotification(rest, this.moduleName)
        .subscribe((value) => {
          if (Object.keys(value).length) {
            const { notificationInfo } = value;
            this.data.notificationInfo = notificationInfo;
          }
          this.isCreateNotification = false;
        });
    } else {
      this.toastService.show({
        type: 'warning',
        text: 'Category is mandatory for notification creation'
      });
      this.isCreateNotification = false;
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
    if (this.router.url === '/forms/observations') {
      this.router.navigate(['/forms/scheduler/1'], {
        queryParams: {
          inspectionId: this.data?.roundId
        }
      });
    }
    if (this.router.url === '/operator-rounds/observations') {
      this.router.navigate(['/operator-rounds/scheduler/1'], {
        queryParams: {
          roundId: this.data?.roundId
        }
      });
    }
  }

  openPreviewDialog() {
    const slideshowImages = [];
    this.filteredMediaType.forEach((media) => {
      slideshowImages.push(media.message);
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

  getUserNameByEmail(emails: string) {
    return this.observations.formatUserFullNameDisplay(emails);
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

  formatDateTime(date) {
    if (
      this.plantTimezoneMap[
        this.issuesActionsDetailViewForm.get('plantId').value
      ]?.timeZoneIdentifier
    ) {
      return localToTimezoneDate(
        date,
        this.plantTimezoneMap[
          this.issuesActionsDetailViewForm.get('plantId').value
        ],
        dateTimeFormat2
      );
    }
    return format(new Date(date), dateTimeFormat2);
  }

  formatDate(date: string) {
    const parsedDate = parseISO(date);
    if (
      this.plantTimezoneMap[
        this.issuesActionsDetailViewForm.get('plantId').value
      ]?.timeZoneIdentifier
    ) {
      return localToTimezoneDate(
        date,
        this.plantTimezoneMap[
          this.issuesActionsDetailViewForm.get('plantId').value
        ],
        dateFormat2
      );
    }
    return format(parsedDate, dateFormat2);
  }

  compareDates(dateString: string): string {
    const parsedDate = parse(dateString, 'dd MMM yyyy', new Date());

    return isToday(parsedDate)
      ? 'Today'
      : isYesterday(parsedDate)
      ? 'Yesterday'
      : format(parsedDate, 'dd MMM yyyy');
  }

  ngOnDestroy(): void {
    this.plantMapSubscription.unsubscribe();
    if (this.amplifySubscription$?.length > 0) {
      this.amplifySubscription$.forEach((subscription) => {
        if (subscription) {
          subscription.unsubscribe();
        }
      });
    }
    this.attachmentsSubscriptionData = [];
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
    this.attachmentsSubscriptionData = [];
    const { id, type, dueDate, dueDateDisplay, notificationInfo } = this.data;
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
      dueDate: dueDateDisplay
        ? new Date(dueDateDisplay)
        : dueDate
        ? new Date(dueDate)
        : '',
      dueDateDisplayValue: dueDateDisplay ? dueDateDisplay : ''
    });
    this.minDate = new Date(this.data.createdAt);
    this.logHistory$ = this.observations
      .getIssueOrActionLogHistory$(id, type, {}, this.moduleName)
      .pipe(
        tap((logHistory) => {
          this.logHistory = logHistory?.rows || [];
          this.filteredMediaType = [];
          if (this.logHistory.length > 0) {
            this.logHistory.forEach((history) => {
              if (
                typeof history?.message === 'object' &&
                history?.message?.PHOTO?.length > 0
              ) {
                history?.message?.PHOTO.forEach((element) => {
                  if (element) {
                    this.filteredMediaType.push({
                      message: element
                    });
                  }
                });
              }
              if (history.type === 'Media') {
                this.filteredMediaType.push(history);
              }
            });
          }
        })
      );
  }

  private prepareSubscriptionResponse(data) {
    const currentChatSelectedId: string =
      this.data?.type === 'issue' ? data?.issueslistID : data?.actionslistID;
    if (this.data?.id === currentChatSelectedId) {
      const newMessage = {
        ...data,
        createdAt: format(new Date(data?.createdAt), dateTimeFormat2),
        message:
          data.type === 'Object' ? JSON.parse(data?.message) : data?.message
      };
      if (newMessage.type === 'Media') {
        const foundImageData = this.attachmentsSubscriptionData.find(
          (a) => a?.id === newMessage?.message
        );
        if (foundImageData) {
          newMessage.message = foundImageData?.imageData || newMessage.message;
        }
      }
      this.filteredMediaType = [];
      this.logHistory = [...this.logHistory, newMessage];
      if (this.logHistory?.length > 0) {
        this.logHistory.forEach((history) => {
          if (
            typeof history?.message === 'object' &&
            history?.message?.PHOTO?.length > 0
          ) {
            history?.message?.PHOTO.forEach((element) => {
              if (element) {
                this.filteredMediaType.push({
                  message: element
                });
              }
            });
          }
          if (history.type === 'Media') {
            this.filteredMediaType.push(history);
          }
        });
      }
      this.logHistory$ = of({
        nextToken: null,
        rows: this.logHistory
      });
    }
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
            dueDate: jsonData?.DUEDATE ? new Date(jsonData?.DUEDATE) : '',
            priority: jsonData.PRIORITY ?? '',
            statusDisplay: this.observations.prepareStatus(
              jsonData.STATUS ?? ''
            ),
            assignedTo: data?.assignedTo,
            assignedToDisplay: this.observations.formatUsersDisplay(
              data?.assignedTo
            ),
            status: jsonData?.STATUS ?? ''
          };
          this.issuesActionsDetailViewForm.patchValue({
            status: this.data.status,
            priority: this.data.priority,
            dueDateDisplayValue: this.formatDate(this.data.dueDate),
            dueDate: this.data.dueDate
              ? new Date(this.data.dueDate)
              : this.data.dueDate,
            statusDisplay: this.data.statusDisplay,
            assignedTo: data?.assignedTo,
            assignedToDisplay: this.observations.formatUsersDisplay(
              data?.assignedTo
            )
          });
          this.allData[idx] = this.data;
        }
      }
    }
  }
}
