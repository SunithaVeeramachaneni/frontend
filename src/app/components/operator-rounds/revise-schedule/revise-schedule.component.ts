import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { scheduleConfigs } from '../../../forms/components/schedular/schedule-configuration/schedule-configuration.constants';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addDays, format, getDay } from 'date-fns';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-revise-schedule',
  templateUrl: './revise-schedule.component.html',
  styleUrls: ['./revise-schedule.component.scss']
})
export class ReviseScheduleComponent implements OnInit {
  @Output() openCloseRightPanelEvent = new EventEmitter<boolean>();
  @Input() payload: any;
  @Input() set nodeIdToNodeName(nodeIdToNodeName: any) {
    this._nodeIdToNodeName = nodeIdToNodeName;
  }
  get nodeIdToNodeName() {
    return this._nodeIdToNodeName;
  }
  locations = {};
  showLocations = true;
  repeatTypes = scheduleConfigs.repeatTypes;
  daysOfWeek = scheduleConfigs.daysOfWeek;
  weeksOfMonth = scheduleConfigs.weeksOfMonth;
  startDatePickerMinDate: Date;
  resviseScheduleConfigForm: FormGroup;
  LocationListToTask$: any;
  locationIdToTaskcount = new Map<string, string>();
  locationIdToTaskcountArr: [string, string][] = [];

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
  _nodeIdToNodeName: any;
  constructor(
    private fb: FormBuilder,
    private operatorRoundService: OperatorRoundsService
  ) {}

  ngOnInit(): void {
    this.LocationListToTask$ = this.operatorRoundService.checkboxStatus$.pipe(
      tap((data) => {
        console.log(data);
        const selectedPage = data.selectedPage;
        const nodeId = data.nodeId;
        if (!this.locationIdToTaskcount.has(nodeId)) {
          this.locationIdToTaskcount.set(nodeId, '0');
        }
        let taskCount = 0;
        let totalTaskCount = 0;
        selectedPage.forEach((page) => {
          page.questions.forEach((question) => {
            if (question.complete) taskCount++;
            totalTaskCount++;
          });
        });
        if (totalTaskCount === taskCount)
          this.locationIdToTaskcount.set(nodeId, 'All ');
        else this.locationIdToTaskcount.set(nodeId, taskCount.toString());
        this.locationIdToTaskcountArr = Array.from(this.locationIdToTaskcount);
      })
    );
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
