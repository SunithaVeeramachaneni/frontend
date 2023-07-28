import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-archived-delete-modal',
  templateUrl: './archive-template-modal.component.html',
  styleUrls: ['./archive-template-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchiveTemplateModalComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<ArchiveTemplateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public templateData
  ) {}

  ngOnInit(): void {}

  archiveTemplate(data) {
    this.dialogRef.close(data);
  }
}
