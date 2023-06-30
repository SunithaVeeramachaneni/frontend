import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-shift',
  templateUrl: './shift-menu-item.component.html',
  styleUrls: ['./shift-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShiftMenuItemComponent implements OnInit {
  @Input()
  set plantId(plantId) {
    this._plantId = plantId;
  }
  get plantSelected(): any {
    return this._plantId;
  }
  @Input() set plantShiftObj(plantShiftObj) {
    this._plantShiftObj = plantShiftObj;
  }
  get plantShiftObj(): any {
    return this._plantShiftObj;
  }

  @Input() set dropdownPosition(dropdownPosition) {
    this._dropdownPosition = dropdownPosition;
  }
  get dropdownPosition(): any {
    return this._dropdownPosition;
  }

  @Output() shiftChange: EventEmitter<any> = new EventEmitter<any>();

  private _dropdownPosition: any;
  private _plantShiftObj: any;
  private _plantId: any;

  constructor() {}

  ngOnInit(): void {}
  optionClick(data) {
    this.shiftChange.emit(data);
  }
}
