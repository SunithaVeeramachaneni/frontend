import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  Form,
  FormBuilder
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormMetadata, ValidationError } from 'src/app/interfaces';
import { formConfigurationStatus, dateFormat4 } from 'src/app/app.constants';
import {
  getFormMetadata,
  State
} from 'src/app/forms/state/builder/builder-state.selectors';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { format } from 'date-fns';

@Component({
  selector: 'app-task-level-scheduler',
  templateUrl: './task-level-scheduler.component.html',
  styleUrls: ['./task-level-scheduler.component.scss']
})
export class TaskLevelSchedulerComponent implements OnInit {
  status: string;
  formConfiguration: FormGroup;
  headerDetails: FormGroup;
  formMetadata: FormMetadata;
  formMetadata$: Observable<FormMetadata>;
  statusList = {
    changesSaved: 'All Changes Saved',
    savingChanges: 'Saving Changes...',
    scheduling: 'Scheduling...',
    revising: 'Revising...'
  };
  statusSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.statusList.changesSaved
  );
  readonly formConfigurationStatus = formConfigurationStatus;

  formDetailPublishStatus: string;

  @Input() set payload(payload: any) {
    this._payload = payload;
    if (payload) {
      console.log('payload', payload);
      this.headerDetails.patchValue(
        {
          AssigneDetails: payload.assignmentDetails.displayValue,
          HeadersStartDate: format(new Date(payload.startDate), dateFormat4),
          HeadersEndDate: format(new Date(payload.endDate), dateFormat4),
          HeaderFrequency: payload.scheduleType
        },
        { emitEvent: true }
      );
      console.log('this.headerDetails', this.headerDetails.value);
    }
  }
  private _payload: any;
  @Input() roundPlanData: any;
  errors: ValidationError = {};
  constructor(private store: Store<State>, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.status = this.statusList.changesSaved;
    this.formConfiguration = this.fb.group({
      id: [''],
      formLogo: [''],
      name: new FormControl(
        {
          value: '',
          disabled: true
        },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ),
      description: [''],
      counter: [0],
      formStatus: [formConfigurationStatus.draft]
    });
    this.headerDetails = this.fb.group({
      HeaderFrequency: [''],
      HeaderStartDate: [''],
      HeaderEndDate: [''],
      AssigneDetails: [''],
      shiftDetails: [''],
      slotDetials: ['']
    });

    console.log('this.roundPlanData', this.roundPlanData);
    const { name, description, id, formLogo, formStatus } =
      this.roundPlanData.roundPlanDetail;
    this.formConfiguration.patchValue(
      {
        name,
        description,
        id,
        formLogo,
        formStatus
      },
      { emitEvent: false }
    );
  }

  getSize(value: string) {
    if (value && value === value.toUpperCase()) {
      return value.length;
    }
    return value.length - 1;
  }
  uploadFormImageFile(e) {
    // uploaded image  file code
  }

  processValidationErrors(controlName: string) {
    const touched = this.formConfiguration.get(controlName).touched;
    const errors = this.formConfiguration.get(controlName).errors;
    this.errors[controlName] = null;
    if (touched && errors) {
      Object.keys(errors).forEach((messageKey) => {
        this.errors[controlName] = {
          name: messageKey,
          length: errors[messageKey]?.requiredLength
        };
      });
    }
    return !touched || this.errors[controlName] === null ? false : true;
  }

  editFormName() {}
}
