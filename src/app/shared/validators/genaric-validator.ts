import { FormGroup } from '@angular/forms';

// Generic validator for Reactive forms
// Implemented as a class, not a service, so it can retain state for multiple forms.
// NOTE: This validator does NOT support validation of controls or groups within a FormArray.
export class GenericValidator {
  constructor() {}

  // Processes each control within a FormGroup
  processValidations(container: FormGroup): any {
    const validations = {};
    for (const controlKey in container.controls) {
      if (container.controls.hasOwnProperty(controlKey)) {
        const c = container.controls[controlKey];
        // If it is a FormGroup, process its child controls.
        if (c instanceof FormGroup) {
          const childValidations = this.processValidations(c);
          Object.assign(validations, { [controlKey]: childValidations });
        } else {
          validations[controlKey] = {};
          if (c.touched && c.errors) {
            Object.keys(c.errors).map((messageKey) => {
              validations[controlKey] = {
                name: messageKey,
                length: c.errors[messageKey]?.requiredLength
              };
            });
          }
        }
      }
    }
    return validations;
  }
}
