import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidationUtil {
  constructor() {}
  processValidationErrors(
    controlName: string,
    form: FormGroup,
    _errors: any
  ): boolean {
    const touched = form.get(controlName).touched;
    const errors = form.get(controlName).errors;
    _errors[controlName] = null;
    return this.checkControlError(_errors, controlName, touched, errors);
  }

  processValidationErrorsFormArrays(
    controlName: string,
    index: number,
    form: FormGroup,
    _errors: any
  ): any {
    const formArray = form.get(controlName) as FormArray;
    const formControl: any = formArray?.at(index);
    const touched = formControl?.controls?.title?.touched;
    const errors = formControl?.controls?.title?.errors;
    return this.checkControlError(_errors, controlName, touched, errors);
  }

  private checkControlError(
    _errors: any,
    controlName: string,
    touched: boolean,
    errors: any
  ): boolean {
    _errors[controlName] = null;
    if (touched && errors) {
      Object.keys(errors).forEach((messageKey) => {
        _errors[controlName] = {
          name: messageKey,
          length: errors[messageKey]?.requiredLength
        };
      });
    }
    return !touched || _errors[controlName] === null ? false : true;
  }
}
