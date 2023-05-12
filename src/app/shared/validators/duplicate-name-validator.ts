import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class DuplicateNameValidator {
  static duplicateNameValidator(namesList: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return namesList.indexOf(control.value) === -1 ? null : { exists: true };
    };
  }
}
