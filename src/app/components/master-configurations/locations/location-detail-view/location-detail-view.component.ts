import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'app-location-detail-view',
  templateUrl: './location-detail-view.component.html',
  styleUrls: ['./location-detail-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationDetailViewComponent implements OnInit {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Input() selectedLocation;
  constructor() {}

  ngOnInit(): void {}

  edit() {
    this.slideInOut.emit('out');
  }

  cancel() {
    this.slideInOut.emit('out');
  }
}
