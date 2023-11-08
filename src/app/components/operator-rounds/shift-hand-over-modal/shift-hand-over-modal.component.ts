import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Step } from 'src/app/interfaces/stepper';

@Component({
  selector: 'app-shift-hand-over-modal',
  templateUrl: './shift-hand-over-modal.component.html',
  styleUrls: ['./shift-hand-over-modal.component.scss']
})
export class ShiftHandOverModalComponent implements OnInit {
  steps: Step[] = [
    { title: 'Summary', content: '' },
    { title: 'Rounds', content: '' },
    { title: 'Observations', content: '' },
    { title: 'Notes and Logs', content: '' },
    { title: 'Operators', content: '' }
  ];

  totalSteps: number;
  currentStep = 0;

  constructor(
    public dialogRef: MatDialogRef<ShiftHandOverModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {}

  goBack(): void {
    this.dialogRef.close();
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
