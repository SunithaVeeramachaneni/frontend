import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-import-questions-modal',
  templateUrl: './import-questions-modal.component.html',
  styleUrls: ['./import-questions-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportQuestionsModalComponent implements OnInit {
  selectedIndex = 0;
  constructor(
    public dialogRef: MatDialogRef<ImportQuestionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.selectedIndex = this.data.tabIndex;
  }
}
