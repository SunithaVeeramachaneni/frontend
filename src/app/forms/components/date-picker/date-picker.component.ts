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
import { Subscription, interval } from 'rxjs';

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
  @ViewChild('picker') picker: any;
  @Input()
  set selectedDate(selectedDate: SelectedDate) {
    if (selectedDate) {
      this._selectedDate = selectedDate;
      this.dateGroup.get('date').patchValue(this.selectedDate.date);
      this.picker?.open();
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
  subscription: Subscription;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.minDate = new Date();
    const interval$ = interval(60000);
    this.subscription = interval$.subscribe(() => {
      this.minDate = new Date();
    });
  }
  dateGroup: FormGroup = this.fb.group({
    date: ''
  });

  onDateChange(event: MatDatetimePickerInputEvent<Date>) {
    this.dateChange.emit(event.value);
  }

  closedEvent() {
    this.closed.emit(true);
    this.subscription.unsubscribe();
  }
}
