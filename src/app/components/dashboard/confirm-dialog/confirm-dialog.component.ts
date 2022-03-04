import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ReportCategory, Widget } from 'src/app/interfaces';

interface DeleteReportData {
  reportName: string;
  groupedWidgets: any;
  reportID: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialog implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DeleteReportData>,
    @Inject(MAT_DIALOG_DATA)
    public data: DeleteReportData
  ) { }

  ngOnInit() {
  }

  confirm() {
    this.dialogRef.close({ confirmed: true });
  }
}
