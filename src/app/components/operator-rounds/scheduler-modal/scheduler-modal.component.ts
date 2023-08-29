import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Step } from 'src/app/interfaces/stepper';
import { State } from 'src/app/state/app.state';

@Component({
  selector: 'app-scheduler-modal',
  templateUrl: './scheduler-modal.component.html',
  styleUrls: ['./scheduler-modal.component.scss']
})
export class SchedulerModalComponent implements OnInit {
  payload: any;
  steps: Step[] = [
    { title: 'Header', content: '' },
    { title: 'Tasks', content: '' }
  ];

  totalSteps: number;
  currentStep = 0;

  constructor(
    private store: Store<State>,
    private router: Router,
    public dialogRef: MatDialogRef<SchedulerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.totalSteps = this.steps.length;
  }

  goBack() {
    if (this.currentStep === 0) {
      this.router.navigate(['operator-rounds/scheduler/0']);
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

  payloadEmitter($event: Event) {
    this.payload = $event;
  }
}
