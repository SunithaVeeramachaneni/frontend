import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-template-modal',
  templateUrl: './delete-template-modal.component.html',
  styleUrls: ['./delete-template-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteTemplateModalComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<DeleteTemplateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public templateData
  ) {}

  ngOnInit(): void {}

  deleteTemplate(data) {
    this.dialogRef.close(data);
  }
}
