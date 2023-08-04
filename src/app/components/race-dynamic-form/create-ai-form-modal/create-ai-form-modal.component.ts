import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RaceDynamicFormService } from '../services/rdf.service';
@Component({
  selector: 'app-create-ai-form-modal',
  templateUrl: './create-ai-form-modal.component.html',
  styleUrls: ['./create-ai-form-modal.component.scss']
})
export class CreateAiFormModalComponent implements OnInit {
  @Inject(MAT_DIALOG_DATA) public data: any;
  promptFormData: FormGroup;
  sections = [];
  formTitle = '';
  constructor(
    private fb: FormBuilder,
    private rdfService: RaceDynamicFormService
  ) {}

  ngOnInit(): void {
    this.promptFormData = this.fb.group({
      prompt: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200)
        ]
      ]
    });
  }
  onPromptSubmit() {
    const prompt = this.promptFormData.value.prompt.trim();
    this.rdfService
      .createSectionsFromPrompt$(prompt, {
        displayToast: true,
        failureResponse: {}
      })
      .subscribe((data) => {
        if (Object.keys(data)?.length) {
          const { formTitle, sections } = data;
          this.formTitle = formTitle;
          this.sections = sections;
        } else {
          console.log('ERROR');
        }
      });
  }
}
