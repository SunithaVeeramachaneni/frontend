import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'app-plant-detail-view',
  templateUrl: './plant-detail-view.component.html',
  styleUrls: ['./plant-detail-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlantDetailViewComponent implements OnInit {
  @Input() selectedPlant;
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    console.log(this.selectedPlant);
  }

  edit() {
    this.slideInOut.emit({ status: 'out', data: this.selectedPlant });
  }

  cancel() {
    this.slideInOut.emit({ status: 'out', data: '' });
  }
}
