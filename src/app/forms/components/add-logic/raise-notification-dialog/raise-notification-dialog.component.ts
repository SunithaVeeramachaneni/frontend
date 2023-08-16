import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationError } from 'src/app/interfaces';

@Component({
  selector: 'app-raise-notification-dailog',
  templateUrl: './raise-notification-dialog.component.html',
  styleUrls: ['./raise-notification-dialog.component.scss']
})
export class RaiseNotificationDailogComponent implements OnInit {
  validationMessage = '';
  operatorSymbolMap = {};
  notificationForm: FormGroup;
  errors: ValidationError = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.notificationForm = this.fb.group({
      triggerInfo: ['', Validators.required],
      triggerWhen: ['', Validators.required]
    });
    const { triggerInfo, triggerWhen } = this.data.logic;
    this.notificationForm.patchValue(
      {
        triggerInfo,
        triggerWhen
      } || {}
    );
    this.validationMessage = '';
  }

  close() {
    this.dialogRef.close();
  }
  submit() {
    this.dialogRef.close({
      notification: this.notificationForm.value,
      validationMessage: this.validationMessage
    });
  }

  processValidationErrors(controlName: string): boolean {
    const touched = this.notificationForm.get(controlName).touched;
    const errors = this.notificationForm.get(controlName).errors;
    this.errors[controlName] = null;
    if (touched && errors) {
      Object.keys(errors).forEach((messageKey) => {
        this.errors[controlName] = {
          name: messageKey
        };
      });
    }
    return !touched || this.errors[controlName] === null ? false : true;
  }

  get form() {
    return this.notificationForm.controls;
  }
}
