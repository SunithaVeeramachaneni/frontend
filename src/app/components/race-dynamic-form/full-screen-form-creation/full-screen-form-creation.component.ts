import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Step } from 'src/app/interfaces/stepper';
import { State, getFormDetails, getFormMetadata } from 'src/app/forms/state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-full-screen-form-creation',
  templateUrl: './full-screen-form-creation.component.html',
  styleUrls: ['./full-screen-form-creation.component.scss']
})
export class FullScreenFormCreationComponent implements OnInit {
  steps: Step[] = [
    { title: 'Form Details', content: '' },
    { title: 'Add Questions', content: '' },
    { title: 'PDF Setup', content: '' }
  ];

  totalSteps: number;
  currentStep = 0;
  formData;

  constructor(
    public dialogRef: MatDialogRef<FullScreenFormCreationComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.totalSteps = this.steps.length;

    this.store.select(getFormMetadata).subscribe((formMetadata) => {
      const { formType } = formMetadata;
      if (formType === 'Embedded') {
        this.steps = [
          { title: 'Form Details', content: '' },
          { title: 'Add Questions', content: '' }
        ];
      }
    });

    this.store.select(getFormDetails).subscribe((formDetails) => {
      const { formMetadata, formListDynamoDBVersion } = formDetails;
      this.formData = {
        formListDynamoDBVersion,
        formMetadata,
        formExists: Object.keys(formMetadata).length === 0 ? false : true
      };
    });
  }

  goBack(): void {
    if (this.currentStep === 0) {
      this.dialogRef.close();
    } else if (this.currentStep > 0) {
      this.gotoPreviousStep();
    }
  }

  onGotoStep(step): void {
    this.currentStep = step;
  }

  gotoNextStep(): void {
    this.currentStep++;
  }

  gotoPreviousStep(): void {
    this.currentStep--;
  }
}
