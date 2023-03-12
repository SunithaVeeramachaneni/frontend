import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'app-observation-detail',
  templateUrl: './observation-detail.component.html',
  styleUrls: ['./observation-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObservationDetailComponent implements OnInit {
  @Input() selectedData: any;
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  onClose(): void {
    this.selectedData = null;
    this.slideInOut.emit('out');
  }
}
