/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'app-shift-menu-item',
  templateUrl: './shift-menu-item.component.html',
  styleUrls: ['./shift-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShiftMenuItemComponent implements OnInit {
  @Input() set allPlants(allPlants) {
    this._allPlants = allPlants;
  }
  get allPlants(): any {
    return this._allPlants;
  }
  @Input()
  set plantId(plantId) {
    this._plantId = plantId;
  }
  get plantId(): any {
    return this._plantId;
  }

  @Input() set dropdownPosition(dropdownPosition) {
    this._dropdownPosition = dropdownPosition;
  }
  get dropdownPosition(): any {
    return this._dropdownPosition;
  }

  @Output() shiftChange: EventEmitter<any> = new EventEmitter<any>();

  private _dropdownPosition: any;
  private _allPlants: any;
  private _plantId: any;

  constructor() {}

  ngOnInit(): void {}
  optionClick(data) {
    this.shiftChange.emit(data);
  }
}
