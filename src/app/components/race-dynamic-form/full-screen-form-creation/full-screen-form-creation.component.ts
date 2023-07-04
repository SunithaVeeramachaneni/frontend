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
    @Inject(MAT_DIALOG_DATA) public data,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.totalSteps = this.steps.length;
  }

  goBack(): void {
    this.router.navigate(['/forms']);
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
