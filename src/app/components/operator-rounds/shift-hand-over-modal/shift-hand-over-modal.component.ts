import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { Step } from 'src/app/interfaces/stepper';
import { ShrService } from '../services/shr.service';
import { Observable } from 'rxjs';
import { ShrSubmissionModalComponent } from '../shr-submission-modal/shr-submission-modal.component';

@Component({
  selector: 'app-shift-hand-over-modal',
  templateUrl: './shift-hand-over-modal.component.html',
  styleUrls: ['./shift-hand-over-modal.component.scss']
})
export class ShiftHandOverModalComponent implements OnInit {
  selectedRow;
  steps: Step[] = [
    { title: 'Summary', content: '', columnId: 'summary' },
    { title: 'Rounds', content: '', columnId: 'rounds' },
    { title: 'Observations', content: '', columnId: 'observations' },
    { title: 'Notes and Logs', content: '', columnId: 'notes' },
    { title: 'Operators', content: '', columnId: 'operators' }
  ];

  totalSteps: number;
  currentStep = 0;

  shrAllDetails$: Observable<any>;
  loggedInUserId = '';
  loggedInUserEmail = '';
  loggedInUserName = '';
  clickedHandover = false;
  loggedInUserTitle = '';
  constructor(
    public dialogRef: MatDialogRef<ShiftHandOverModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private shrService: ShrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.shrAllDetails$ = this.shrService.getSHRDetailsId$(this.data.id);
    this.loggedInUserId = this.data?.loggedInUserId;
    this.loggedInUserEmail = this.data?.loggedInUserEmail;
    this.loggedInUserName = this.data?.loggedInUserName;
    this.loggedInUserTitle = this.data?.loggedInUserTitle;

    this.updateSHRSteps();
    this.selectedRow = this.data;
  }

  updateSHRSteps() {
    for (const shrData of this.data.shrConfigColumns) {
      if (shrData.content && !shrData.selected) {
        let value = false;
        for (const content of shrData.content) {
          if (content.selected) value = true;
        }
        if (!value) {
          this.steps = this.steps.filter(
            (val) => val.columnId !== shrData.columnId
          );
        }
      } else {
        if (!shrData.selected) {
          this.steps = this.steps.filter(
            (val) => val.columnId !== shrData.columnId
          );
        }
      }
    }
  }

  goBack(): void {
    this.dialogRef.close({ handOver: this.clickedHandover, data: this.data });
  }

  onGotoStep(step): void {
    this.currentStep = step;
  }

  gotoNextStep(): void {
    this.currentStep++;
    if (this.currentStep === this.steps.length) this.openShrSubmissionModal();
  }

  gotoPreviousStep(): void {
    this.currentStep--;
  }
  updateSHRList() {
    this.shrService
      .updateSHRList$(this.data.id, {
        shiftSupervisorId: this.loggedInUserId,
        shiftSupervisorEmail: this.loggedInUserEmail
      })
      .subscribe(() => {
        this.clickedHandover = true;
        this.data.shiftSupervisorId = this.loggedInUserId;
        this.data.shiftSupervisorEmail = this.loggedInUserEmail;
        this.data.shiftSupervisor = this.loggedInUserName;
        this.data.title = this.loggedInUserTitle;
      });
  }

  openShrSubmissionModal() {
    const shrDialogRef = this.dialog.open(ShrSubmissionModalComponent, {
      height: 'auto',
      width: '50%',
      data: this.selectedRow
    });

    shrDialogRef.afterClosed().subscribe((data) => {
      this.dialogRef.close();
    });
  }
}
