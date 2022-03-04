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

export interface DeleteReportData {
  reportName: string;
  groupedWidgets: any;
  reportID: string;
}

@Component({
  selector: 'app-report-delete-modal',
  templateUrl: './report-delete-modal.component.html',
  styleUrls: ['./report-delete-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportDeleteModalComponent implements OnInit {
  isPopoverOpen = false;
  private reportID;
  private reportName;
  private groupedWidgets;
  private widgetCount;

  constructor(
    private dialogRef: MatDialogRef<ReportDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: DeleteReportData
  ) {}

  ngOnInit() {
    const { reportID, reportName, groupedWidgets } = this.data;
    this.reportID = reportID;
    this.reportName = reportName;
    this.groupedWidgets = groupedWidgets;
    this.getWidgetCount();
  }

  getWidgetCount() {
    let count = 0;
    this.groupedWidgets.forEach(
      (dashboard) => (count += dashboard.widgets.length)
    );

    // this.groupedWidgets.forEach(dashboard => count += dashboard.length);
    this.widgetCount = count;
  }

  deleteReport() {
    this.dialogRef.close(this.reportID);
  }
}
