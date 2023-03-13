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
      name: '',
      description: '',
      category: '',
      round: '',
      location: '',
      asset: '',
      task: '',
      priority: 'High',
      status: 'Open',
      dueDate: '',
      assignedTo: 'John',
      raisedBy: ''
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
