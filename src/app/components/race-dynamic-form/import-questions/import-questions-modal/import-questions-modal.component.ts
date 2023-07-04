import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-import-questions-modal',
  templateUrl: './import-questions-modal.component.html',
  styleUrls: ['./import-questions-modal.component.scss']
})
export class ImportQuestionsModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ImportQuestionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {}
}
