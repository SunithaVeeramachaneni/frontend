import { FormGroup } from '@angular/forms';

// Generic validator for Reactive forms
// Implemented as a class, not a service, so it can retain state for multiple forms.
// NOTE: This validator does NOT support validation of controls or groups within a FormArray.
export class GenericValidator {
  constructor() {}

  // Processes each control within a FormGroup
  processMessages(container: FormGroup): {
    [key: string]: { name: string; length: number };
  } {
    const messages = {};
    for (const controlKey in container.controls) {
      if (container.controls.hasOwnProperty(controlKey)) {
        const c = container.controls[controlKey];
        // If it is a FormGroup, process its child controls.
        if (c instanceof FormGroup) {
          const childMessages = this.processMessages(c);
          Object.assign(messages, childMessages);
        } else {
          messages[controlKey] = {};
          if (c.touched && c.errors) {
            Object.keys(c.errors).map((messageKey) => {
              messages[controlKey] = {
                name: messageKey,
                length: c.errors[messageKey]?.requiredLength
              };
            });
          }
        }
      }
    }
    return messages;
  }
}
