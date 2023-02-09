import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidationError } from 'src/app/interfaces';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { UnitMeasurementService } from '../services';

@Component({
  selector: 'app-edit-unit-popup',
  templateUrl: './edit-unit-popup.component.html',
  styleUrls: ['./edit-unit-popup.component.scss']
})
export class EditUnitPopupComponent implements OnInit {
  public unitType: string;
  public measurementList: any[];
  errors: ValidationError = {};
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
    isDeleted: [false, [Validators.required]]
  });
  constructor(
    private readonly dialogRef: MatDialogRef<EditUnitPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public formData: any,
    private readonly formBuilder: FormBuilder,
    private readonly unitOfMeasurementService: UnitMeasurementService
  ) {}

  ngOnInit(): void {
    this.measurementList = this.unitOfMeasurementService.measurementList;
    if (this.formData) {
      this.unitForm.patchValue({
        unitType: this.formData?.unitType,
        symbol: this.formData?.symbol,
        description: this.formData?.description,
        isDeleted: this.formData?.isDeleted
      });
    }
  }

  cancel(data) {
    this.dialogRef.close(data);
  }

  onSave(data) {
    if (this.unitForm.invalid) {
      return;
    }
    this.dialogRef.close({
      action: data,
      ...this.formData,
      unitType: this.unitForm.value.unitType,
      symbol: this.unitForm.value.symbol,
      description: this.unitForm.value.description,
      isDeleted: this.unitForm.value.isDeleted
    });
  }

  processValidationErrors(controlName: string): boolean {
    const touched = this.unitForm?.get(controlName).touched;
    const errors = this.unitForm?.get(controlName).errors;
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
}
