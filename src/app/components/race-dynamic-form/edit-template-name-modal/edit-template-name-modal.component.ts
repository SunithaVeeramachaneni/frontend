import { Component, OnInit, Inject } from '@angular/core';
import { RaceDynamicFormService } from '../services/rdf.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-template-name-modal',
  templateUrl: './edit-template-name-modal.component.html',
  styleUrls: ['./edit-template-name-modal.component.scss']
})
export class EditTemplateNameModalComponent implements OnInit {
  constructor(
    private rdfService: RaceDynamicFormService,
    private dialogRef: MatDialogRef<EditTemplateNameModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit(): void {}

  save() {
    this.rdfService.deleteTemplate$(this.data.templateId).subscribe();
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close(false);
  }
}
