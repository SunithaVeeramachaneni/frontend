/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input
} from '@angular/core';
import { scheduleConfigs } from '../../../forms/components/schedular/schedule-configuration/schedule-configuration.constants';
import {
  MatCalendarCellCssClasses,
  MatDatepickerInputEvent
} from '@angular/material/datepicker';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { format } from 'date-fns';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-revise-schedule',
  templateUrl: './revise-schedule.component.html',
  styleUrls: ['./revise-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviseScheduleComponent implements OnInit {
  @Output() openCloseRightPanelEvent = new EventEmitter<boolean>();
  @Input() set nodeIdToNodeName(nodeIdToNodeName: any) {
    this._nodeIdToNodeName = nodeIdToNodeName;
  }
  get nodeIdToNodeName() {
    return this._nodeIdToNodeName;
  }
  @Input() set reviseSchedule(reviseSchedule: any) {
    this.reviseScheduleConfig = reviseSchedule;
    this.shiftsSelected.patchValue(this.reviseScheduleConfig.shiftSlots);
  }
  get reviseSchedule() {
    return this.reviseScheduleConfig;
  }
  locations = {};
  showLocations = true;
  repeatTypes = scheduleConfigs.repeatTypes;
  daysOfWeek = scheduleConfigs.daysOfWeek;
  weeksOfMonth = scheduleConfigs.weeksOfMonth;
  resviseScheduleConfigForm: FormGroup;
  shiftsSelected = new FormControl('');
  allSlots = [];
  allShifts = [];
  reviseScheduleConfig;
  locationListToTask$: any;
  locationIdToTaskcount = new Map<string, string>();
  locationIdToTaskcountArr: [string, string][] = [];
  _nodeIdToNodeName: any;

  constructor(
    private fb: FormBuilder,
    private operatorRoundService: OperatorRoundsService
  ) {}

  ngOnInit(): void {
    this.locationListToTask$ = this.operatorRoundService.checkboxStatus$.pipe(
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
      scheduleType: [''],
      repeatDuration: ['', [Validators.required, Validators.min(1)]],
      repeatEvery: [''],
      daysOfWeek: [[]],
      monthlyDaysOfWeek: this.fb.array([]),
      startDate: [''],
      startDatePicker: [''],
      endDate: [''],
      endDatePicker: ['']
    });

    if (this.reviseScheduleConfig) {
      this.resviseScheduleConfigForm.patchValue({
        scheduleType: this.reviseScheduleConfig.scheduleType,
        repeatDuration: this.reviseScheduleConfig.repeatDuration,
        repeatEvery: this.reviseScheduleConfig.repeatEvery,
        daysOfWeek: this.reviseScheduleConfig.daysOfWeek,
        monthlyDaysOfWeek: this.reviseScheduleConfig.monthlyDaysOfWeek,
        startDate: format(
          new Date(this.reviseScheduleConfig.startDate),
          'd MMM yyyy'
        ),
        startDatePicker: new Date(this.reviseScheduleConfig.startDate),
        endDate: format(
          new Date(this.reviseScheduleConfig.endDate),
          'd MMM yyyy'
        ),
        endDatePicker: new Date(this.reviseScheduleConfig.endDate)
      });

      this.allSlots = this.reviseScheduleConfig.shiftSlots;
      this.allShifts = this.reviseScheduleConfig.shiftSlots;
    }
  }

  get monthlyDaysOfWeek(): FormArray {
    return this.resviseScheduleConfigForm.get('monthlyDaysOfWeek') as FormArray;
  }

  get selectedShiftData(): string {
    if (this.allShifts.length > 0) {
      return this.allShifts
        ?.slice(0, 3)
        .map((s) => s?.name)
        .join(', ');
    }
    return '';
  }

  initMonthWiseWeeklyDaysOfWeek(weeksCount: number) {
    return new Array(weeksCount).fill(0).map((v, i) => this.fb.control([[]]));
  }

  updateDate(
    event: MatDatepickerInputEvent<Date>,
    formControlDateField: string
  ) {
    if (formControlDateField === 'startDate') {
      this.resviseScheduleConfigForm.patchValue(
        { startDate: format(new Date(event.target.value), 'd MMM yyyy') },
        { emitEvent: false }
      );
    } else if (formControlDateField === 'endDate') {
      this.resviseScheduleConfigForm.patchValue(
        { endDate: format(new Date(event.target.value), 'd MMM yyyy') },
        { emitEvent: false }
      );
    }
  }

  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      const highlightDate = this.reviseScheduleConfig?.scheduleByDates
        .map((strDate) => new Date(strDate.date))
        .some(
          (d) =>
            d.getDate() === date.getDate() &&
            d.getMonth() === date.getMonth() &&
            d.getFullYear() === date.getFullYear()
        );
      if (highlightDate) {
        return ['selected'];
      }
    };
  }

  updateScheduleByDates(event: MatDatepickerInputEvent<Date>) {}

  onShiftChange(event) {
    console.log(event);
  }

  cancel() {
    this.openCloseRightPanelEvent.emit(false);
  }

  compareFn(o1: any, o2: any) {
    if (o1.id === o2.id) return true;
    else return false;
  }
}
