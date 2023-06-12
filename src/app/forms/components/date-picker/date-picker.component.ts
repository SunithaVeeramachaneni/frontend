/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

interface SelectedDate {
  date: Date;
}

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent implements OnInit {
  @ViewChild('picker') picker;
  @Input()
  set selectedDate(selectedDate: SelectedDate) {
    if (selectedDate) {
      this._selectedDate = selectedDate;
      this.picker.open();
    }
  }
  get selectedDate() {
    return this._selectedDate;
  }
  @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() closed: EventEmitter<boolean> = new EventEmitter<boolean>();
  currentDate = new Date();
  _selectedDate: SelectedDate;

  constructor() {}

  ngOnInit(): void {}

  onDateChange(event: any) {
    this.dateChange.emit(event.target.value);
  }

  closedEvent() {
    this.closed.emit(true);
  }
}
