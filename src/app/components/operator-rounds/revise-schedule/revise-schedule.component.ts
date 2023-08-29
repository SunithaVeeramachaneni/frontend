import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { scheduleConfigs } from '../../../forms/components/schedular/schedule-configuration/schedule-configuration.constants';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addDays, format, getDay } from 'date-fns';

@Component({
  selector: 'app-revise-schedule',
  templateUrl: './revise-schedule.component.html',
  styleUrls: ['./revise-schedule.component.scss']
})
export class ReviseScheduleComponent implements OnInit {
  @Output() openCloseRightPanelEvent = new EventEmitter<boolean>();
  locations = [
    {
      name: 'Fuel Gas System',
      count: 4
    },
    {
      name: 'Fuel Gas System',
      count: 4
    },
    {
      name: 'Fuel Gas System',
      count: 4
    },
    {
      name: 'Fuel Gas System',
      count: 4
    },
    {
      name: 'Fuel Gas System',
      count: 4
    }
  ];
  showLocations = true;
  repeatTypes = scheduleConfigs.repeatTypes;
  daysOfWeek = scheduleConfigs.daysOfWeek;
  weeksOfMonth = scheduleConfigs.weeksOfMonth;
  startDatePickerMinDate: Date;
  resviseScheduleConfigForm: FormGroup;
  shiftsInformation = [
    {
      id: '1',
      name: 'Shift A',
      startTime: '6:00 AM',
      endTime: '2:00 PM'
    },
    {
      id: '2',
      name: 'Shift B',
      startTime: '6:00 PM',
      endTime: '8:00 PM'
    }
  ];
  currentDate: Date;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.resviseScheduleConfigForm = this.fb.group({
      scheduleType: 'byFrequency',
      repeatDuration: [1, [Validators.required, Validators.min(1)]],
      repeatEvery: ['day'],
      daysOfWeek: [[getDay(new Date())]],
      monthlyDaysOfWeek: this.fb.array(
        this.initMonthWiseWeeklyDaysOfWeek(this.weeksOfMonth.length)
      ),
      startDate: format(new Date(), 'd MMMM yyyy'),
      startDatePicker: new Date(),
      endDate: format(addDays(new Date(), 30), 'd MMMM yyyy'),
      endDatePicker: new Date(addDays(new Date(), 30))
    });

    console.log(this.resviseScheduleConfigForm);

    this.startDatePickerMinDate = new Date();
    this.currentDate = new Date();
  }

  get monthlyDaysOfWeek(): FormArray {
    return this.resviseScheduleConfigForm.get('monthlyDaysOfWeek') as FormArray;
  }

  initMonthWiseWeeklyDaysOfWeek(weeksCount: number) {
    return new Array(weeksCount).fill(0).map((v, i) => this.fb.control([[]]));
  }

  updateDate(
    event: MatDatepickerInputEvent<Date>,
    formControlDateField: string
  ) {}

  updateScheduleByDates(event: MatDatepickerInputEvent<Date>) {}

  cancel() {
    this.openCloseRightPanelEvent.emit(false);
  }
}
