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
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDatetimePickerInputEvent } from '@angular-material-components/datetime-picker/public-api';

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
      console.log('date', selectedDate);
      console.log(this.dateGroup.controls);
      this.dateGroup.get('date').setValue(this.selectedDate.date);
      this.picker.open();
    }
  }
  get selectedDate() {
    return this._selectedDate;
  }
  @Input() minDate: Date;
  @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() closed: EventEmitter<boolean> = new EventEmitter<boolean>();
  currentDate = new Date();
  _selectedDate: SelectedDate;
  mindate: any;

  constructor(private fb: FormBuilder) {
    this.minDate = new Date();
  }

  ngOnInit(): void {}
  dateGroup: FormGroup = this.fb.group({
    date: ''
  });

  onDateChange(event: MatDatetimePickerInputEvent<Date>) {
    this.dateChange.emit(event.value);
  }

  closedEvent() {
    this.closed.emit(true);
  }
}
