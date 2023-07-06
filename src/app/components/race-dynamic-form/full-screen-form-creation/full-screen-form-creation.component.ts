import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Step } from 'src/app/interfaces/stepper';
import { Router } from '@angular/router';

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
  constructor(
    public dialogRef: MatDialogRef<FullScreenFormCreationComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.totalSteps = this.steps.length;
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
