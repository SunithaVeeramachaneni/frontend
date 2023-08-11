import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { PlantService } from '../services/plant.service';

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
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private plantService: PlantService
  ) {}

  ngOnInit(): void {}

  edit() {
    this.slideInOut.emit({ status: 'out', data: this.selectedPlant });
    this.plantService.sendData(this.selectedPlant);

    this.changeDetectorRef.detectChanges();
  }

  cancel() {
    this.slideInOut.emit({ status: 'out', data: '' });
  }

  selectedPlantImageurl(plant: any) {
    return plant.image || 'assets/master-configurations/default-plant.svg';
  }
}
