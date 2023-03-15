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
  priority: ['High', 'Medium', 'Low'];
  status: ['Open', 'In-Progress'];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<IssuesActionsDetailViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.issuesActionsDetailViewForm = this.fb.group({
      name: this.data?.Title || '',
      description: this.data?.Description || '',
      category: this.data?.Category || '',
      round: this.data?.Round || '',
      location: this.data?.Location || '',
      asset: this.data?.Asset || '',
      task: this.data?.taskDesciption || '',
      priority: this.data?.Priority || '',
      status: this.data?.Status || '',
      dueDate: this.data?.dueDate
        ? new Date(this.data['Due Date and Time'])
        : '',
      assignedTo: this.data?.assignee || '',
      raisedBy: this.data?.createdBy || ''
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
