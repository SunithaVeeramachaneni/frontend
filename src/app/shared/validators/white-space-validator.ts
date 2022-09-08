import { AbstractControl, ValidationErrors } from '@angular/forms';

export class WhiteSpaceValidator {
  static whiteSpace(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (value && value.trim() === '') {
      return { whiteSpace: true };
    }
    return null;
  }

  static trimWhiteSpace(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (
      value &&
      value.trim() !== '' &&
      (value.startsWith(' ') || value.endsWith(' '))
    ) {
      return { trimWhiteSpace: true };
    }
    return null;
  }
}
