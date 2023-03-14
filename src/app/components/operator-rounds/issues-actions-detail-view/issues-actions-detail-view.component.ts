import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-issues-actions-detail-view',
  templateUrl: './issues-actions-detail-view.component.html',
  styleUrls: ['./issues-actions-detail-view.component.scss']
})
export class IssuesActionsDetailViewComponent implements OnInit {
  issuesActionsDetailViewForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<IssuesActionsDetailViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.issuesActionsDetailViewForm = this.fb.group({
      name: 'Issue in the Boiler',
      description: 'Issue in the Boiler Description',
      category: 'Environmental Safety',
      round: 'Weekly Oil & Water Inspection',
      location: 'Water Treatment Plant',
      asset: '',
      task: 'Check the wind Pressure at the entrance',
      priority: 'High',
      status: 'Open',
      dueDate: '3/16/2023',
      assignedTo: 'John',
      raisedBy: 'John',
      createdBy: 'John'
    });
  }

  onKey(event) {
    const value = event.target.value || '';
    // this.allParentsData = this.search(value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
