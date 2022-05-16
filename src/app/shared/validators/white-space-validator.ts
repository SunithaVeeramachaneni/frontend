import { AbstractControl, ValidationErrors } from '@angular/forms';

export class WhiteSpaceValidator {
  static noWhiteSpace(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (value !== '' && value.trim() === '') {
      return { noWhiteSpace: true };
    }
    return null;
  }
}
