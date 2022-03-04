import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Widget } from 'src/app/interfaces';

export interface WidgetDeleteModalData {
  widget: Widget;
}

@Component({
  selector: 'app-widget-delete-modal',
  templateUrl: './widget-delete-modal.component.html',
  styleUrls: ['./widget-delete-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetDeleteModalComponent implements OnInit {
  widget: Widget;

  constructor(
    private dialogRef: MatDialogRef<WidgetDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: WidgetDeleteModalData
  ) {}

  ngOnInit(): void {
    const { widget } = this.data;
    this.widget = widget;
  }

  deleteWidget = () => {
    this.dialogRef.close(this.widget.id);
  };
}
