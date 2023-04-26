import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { ValidationError } from 'src/app/interfaces';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { RaceDynamicFormService } from '../services/rdf.service';

@Component({
  selector: 'app-save-template-naming-modal',
  templateUrl: './save-template-naming-modal.component.html',
  styleUrls: ['./save-template-naming-modal.component.scss']
})
export class SaveTemplateNamingModalComponent implements OnInit {
  @Input() placeholderName: string;
  @Output() templateState: EventEmitter<any> = new EventEmitter<any>();

  saveTemplateForm = this.fb.group({
    templateName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
      Validators.pattern('^[a-zA-Z0-9 -]+$'),
      WhiteSpaceValidator.whiteSpace,
      WhiteSpaceValidator.trimWhiteSpace
    ])
  });
  errors: ValidationError;
  constructor(
    private fb: FormBuilder,
    private rdfService: RaceDynamicFormService
  ) {}

  ngOnInit(): void {
    this.saveTemplateForm.patchValue({
      templateName: `Template - ${this.placeholderName}`
    });
    this.saveTemplateForm.markAsDirty();
  }

  processValidationErrors(): boolean {
    const touched = this.saveTemplateForm.get('templateName').touched;
    const errors = this.saveTemplateForm.get('templateName').errors;
    this.errors = null;

    if (touched && errors) {
      const messageKey = Object.keys(errors)[0];
      this.errors = {
        name: messageKey,
        length: errors[messageKey]?.requiredLength
      };
    }
    return !touched || this.errors === null ? false : true;
  }

  next() {
    const templateName = this.saveTemplateForm.get('templateName').value;
    this.rdfService.fetchTemplateByName$(templateName).subscribe((res: any) => {
      this.templateState.emit({
        templateName,
        templateId: res.rows.length > 0 ? res.rows[0].id : null
      });
    });
  }
}
