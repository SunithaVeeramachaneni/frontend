import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-save-template-container',
  templateUrl: './save-template-container.component.html',
  styleUrls: ['./save-template-container.component.scss']
})
export class SaveTemplateContainerComponent implements OnInit {
  displayConfirm = false;
  templateName: string;
  templateId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private dialogRef: MatDialogRef<SaveTemplateContainerComponent>
  ) {}

  ngOnInit(): void {}

  advanceStep(event: any) {
    this.templateName = event.templateName;
    this.templateId = event.templateId;
    this.displayConfirm = true;
  }

  close() {
    this.dialogRef.close();
  }
}
