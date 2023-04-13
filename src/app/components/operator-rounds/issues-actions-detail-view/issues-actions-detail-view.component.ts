import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { format } from 'date-fns';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';
import {
  AssigneeDetails,
  SelectedAssignee,
  UpdateIssueOrActionEvent,
  UserDetails
} from 'src/app/interfaces';
import { LoginService } from '../../login/services/login.service';
import { UsersService } from '../../user-management/services/users.service';
import { RoundPlanObservationsService } from '../services/round-plan-observation.service';

@Component({
  selector: 'app-issues-actions-detail-view',
  templateUrl: './issues-actions-detail-view.component.html',
  styleUrls: ['./issues-actions-detail-view.component.scss']
})
export class IssuesActionsDetailViewComponent implements OnInit, OnDestroy {
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
    assignedTo: '',
    raisedBy: ''
  });
  priorities = ['High', 'Medium', 'Low'];
  statuses = ['Open', 'In-Progress', 'Resolved'];
  statusValues = ['Open', 'In Progress', 'Resolved'];
  minDate: Date;
  users$: Observable<UserDetails[]>;
  logHistory$: Observable<History[]>;
  assigneeDetails: AssigneeDetails;
  updatingDetails = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<IssuesActionsDetailViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private observations: RoundPlanObservationsService,
    private loginService: LoginService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    const { id, type, users$ } = this.data;
    this.users$ = users$.pipe(
      tap((users: UserDetails[]) => (this.assigneeDetails = { users }))
    );
    this.issuesActionsDetailViewForm.patchValue({
      ...this.data,
      dueDate: new Date(this.data.dueDate),
      dueDateDisplayValue: format(new Date(this.data.dueDate), 'dd MMM yyyy')
    });
    this.minDate = new Date(this.data.createdAt);
    this.logHistory$ = this.observations.getIssueOrActionLogHistory$(
      id,
      type,
      {}
    );
    this.observations
      .onCreateIssueOrActionLogHistoryEventSource(
        `${type}/log-history/sse/${id}`
      )
      .subscribe();
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
          issueOrActionDBVersion,
          history: {
            type: 'Object',
            message: JSON.stringify({ [field.toUpperCase()]: value }),
            [`${type}slistID`]: id,
            username: this.loginService.getLoggedInEmail()
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

  ngOnDestroy(): void {
    this.observations.closeOnCreateIssueOrActionLogHistoryEventSourceEventSource();
  }
}
