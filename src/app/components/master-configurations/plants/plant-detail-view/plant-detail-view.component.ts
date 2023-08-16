import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { plantImg } from 'src/app/app.constants';

@Component({
  selector: 'app-plant-detail-view',
  templateUrl: './plant-detail-view.component.html',
  styleUrls: ['./plant-detail-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlantDetailViewComponent implements OnInit {
  @Input() selectedPlant;
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  placeHolder = '--';
  constructor() {}

  ngOnInit(): void {}

  edit() {
    this.slideInOut.emit({ status: 'out', data: this.selectedPlant });
  }

  cancel() {
    this.slideInOut.emit({ status: 'out', data: '' });
  }

  selectedPlantImageurl(plant: any) {
    return plant.image || plantImg;
  }
}
