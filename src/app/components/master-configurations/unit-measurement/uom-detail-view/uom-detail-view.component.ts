import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-uom-detail-view',
  templateUrl: './uom-detail-view.component.html',
  styleUrls: ['./uom-detail-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnitOfMeasurementDetailViewComponent implements OnInit {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Input() selectedUnit;
  constructor() {}

  ngOnInit(): void {}

  edit() {
    this.slideInOut.emit({ status: 'out', data: this.selectedUnit });
  }

  cancel() {
    this.slideInOut.emit({ status: 'out', data: '' });
  }
}
