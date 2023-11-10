import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ShrService } from '../services/shr.service';

@Component({
  selector: 'app-shr-submission-modal',
  templateUrl: './shr-submission-modal.component.html',
  styleUrls: ['./shr-submission-modal.component.scss']
})
export class ShrSubmissionModalComponent implements OnInit {
  submitDetails = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public submitDialogRef: MatDialogRef<ShrSubmissionModalComponent>,
    private shrService: ShrService
  ) {}

  ngOnInit(): void {
    this.prepareSubmitDetails();
  }

  prepareSubmitDetails() {
    if (!this.data) return;
    const { shiftNames, shiftSupervisor, plant, unit } = this.data;
    this.submitDetails = [
      {
        label: 'Handover Date & Time',
        value: this.getFormattedDate(new Date().toString())
      },
      { label: 'Shift', value: shiftNames },
      { label: 'Submitted by', value: shiftSupervisor },
      { label: 'Plant', value: plant.name },
      { label: 'Unit', value: unit },
      { label: 'Report will be mailed to', value: '' }
    ];
  }

  getFormattedDate = (date: string) => {
    const myDate = new Date(date).toLocaleDateString('en-us', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const time = new Date(date).toLocaleTimeString('en-US');

    return `${myDate} ${time}`;
  };

  handleOnCancel() {
    this.submitDialogRef.close();
  }
  handleOnSubmit() {
    const id = this.data.id;
    const body = {
      submittedOn: new Date().toISOString(),
      handoverStatus: 'submitted'
    };
    this.shrService.submitSHRReport(id, body).subscribe((res) => {
      this.submitDialogRef.close();
    });
  }
}
