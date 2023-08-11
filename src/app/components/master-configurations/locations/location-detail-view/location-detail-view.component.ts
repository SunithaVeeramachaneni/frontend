import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-location-detail-view',
  templateUrl: './location-detail-view.component.html',
  styleUrls: ['./location-detail-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationDetailViewComponent implements OnInit {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Input() selectedLocation;
  constructor(private locationService: LocationService) {}

  ngOnInit(): void {}

  edit() {
    this.slideInOut.emit({ status: 'out', data: this.selectedLocation });
    this.locationService.sendLocationData(this.selectedLocation);
  }

  cancel() {
    this.slideInOut.emit({ status: 'out', data: '' });
  }
}
