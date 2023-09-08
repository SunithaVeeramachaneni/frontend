import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Step } from 'src/app/interfaces/stepper';
import { AlertModalComponent } from './alert-modal/alert-modal.component';

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
    private router: Router,
    public dialogRef: MatDialogRef<SchedulerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.totalSteps = this.steps.length;
  }

  goBack() {
    const alertDialog = this.dialog.open(AlertModalComponent, {
      height: '142px',
      width: '400px'
    });
    alertDialog.afterClosed().subscribe((res) => {
      if (res) {
        this.router.navigate(['operator-rounds/scheduler/0']);
        this.dialogRef.close();
      }
    });
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
