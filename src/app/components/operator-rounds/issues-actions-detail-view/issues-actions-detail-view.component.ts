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
      name: this.data.name,
      description: this.data.name,
      category: this.data.category,
      round: this.data.round,
      location: this.data.location,
      asset: this.data.asset,
      task: this.data.task,
      priority: this.data.priority,
      status: this.data.status,
      dueDate: this.data.dueDate,
      assignedTo: this.data.assignedTo,
      raisedBy: this.data.raisedBy
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
