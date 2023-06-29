import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class ShiftComponent implements OnInit {
  @ViewChild('shiftOpen') shiftOpen;
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  @Input()
  set plantSelected(plantSelected) {
    this._plantSelected = plantSelected;
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

  @Output() shiftChange: EventEmitter<any> = new EventEmitter<any>();

  public _dropdownPosition: any;
  public _plantShiftObj: any;
  public _plantSelected: any;

  constructor() {}

  ngOnInit(): void {}
  optionClick(data) {
    this.shiftChange.emit(data);
  }
}
