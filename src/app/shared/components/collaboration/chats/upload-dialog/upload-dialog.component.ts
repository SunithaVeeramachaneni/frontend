import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements OnInit {
  attachment: any;

  constructor(public dialogRef: MatDialogRef<UploadDialogComponent>) {}

  ngOnInit() {}

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.attachment = file;
    }
  }

  uploadFile() {
    this.dialogRef.close(this.attachment);
  }

  closeUploadDialog(): void {
    this.dialogRef.close();
  }
}
