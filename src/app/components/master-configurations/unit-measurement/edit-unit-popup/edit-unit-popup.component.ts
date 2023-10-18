/* eslint-disable @typescript-eslint/naming-convention */
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { ValidationError } from 'src/app/interfaces';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { FormValidationUtil } from 'src/app/shared/utils/formValidationUtil';

@Component({
  selector: 'app-edit-unit-popup',
  templateUrl: './edit-unit-popup.component.html',
  styleUrls: ['./edit-unit-popup.component.scss']
})
export class EditUnitPopupComponent implements OnInit {
  public errors: ValidationError = {};
  public unitForm = this.formBuilder.group({
    unitType: [
      '',
      [
        Validators.required,
        WhiteSpaceValidator.whiteSpace,
        WhiteSpaceValidator.trimWhiteSpace
      ]
    ],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(48),
        WhiteSpaceValidator.whiteSpace,
        WhiteSpaceValidator.trimWhiteSpace
      ]
    ],
    symbol: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(48),
        WhiteSpaceValidator.whiteSpace,
        WhiteSpaceValidator.trimWhiteSpace
      ]
    ],
    isActive: [false, [Validators.required]]
  });
  public unitList: { unitType: string }[] = [];
  constructor(
    private readonly dialogRef: MatDialogRef<EditUnitPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public formData: any,
    private readonly formBuilder: FormBuilder,
    private readonly formValidationUtilService: FormValidationUtil
  ) {}

  ngOnInit(): void {
    if (this.formData) {
      this.unitList = this.formData?.units || [];
      this.unitForm.patchValue({
        unitType: this.formData?.unitType ?? '',
        symbol: this.formData?.symbol ?? '',
        description: this.formData?.description ?? '',
        isActive: this.formData?.isActive ?? false
      });
    }
  }

  cancel(data): void {
    this.dialogRef.close(data);
  }

  markAsTouched(group: FormGroup): void {
    group.markAsTouched({ onlySelf: true });
    Object.keys(group.controls).map((field) => {
      const control = group.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.markAsTouched(control);
      }
    });
  }

  onSave(data): void {
    this.markAsTouched(this.unitForm);
    if (this.unitForm.invalid) {
      return;
    }
    this.dialogRef.close({
      action: data,
      ...this.formData,
      unitType: this.unitForm.value.unitType,
      symbol: this.unitForm.value.symbol,
      description: this.unitForm.value.description,
      isActive: this.unitForm.value.isActive
    });
  }

  processValidationErrors(controlName: string): boolean {
    return this.formValidationUtilService.processValidationErrors(
      controlName,
      this.unitForm,
      this.errors
    );
  }
}
