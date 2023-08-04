import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-create-ai-form-modal',
  templateUrl: './create-ai-form-modal.component.html',
  styleUrls: ['./create-ai-form-modal.component.scss']
})
export class CreateAiFormModalComponent implements OnInit {
  @Inject(MAT_DIALOG_DATA) public data: any;
  promptFormData: FormGroup;
  constructor(private fb: FormBuilder) {}

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
    console.log(this.promptFormData.value.prompt.trim());
  }
}
