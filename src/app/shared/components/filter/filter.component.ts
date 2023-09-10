/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @angular-eslint/no-output-native */
/* eslint-disable @typescript-eslint/member-ordering */
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FilterSidePanelComponent } from '../filter-side-panel/filter-side-panel.component';
import { DatePipeDateAdapter } from '../../utils/DatePipeDateAdapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatOption
} from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  skip,
  startWith,
  takeUntil,
  tap
} from 'rxjs/operators';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: DatePipeDateAdapter },
    {
      provide: MAT_DATE_FORMATS,
      // Pass any format string you would pass to DatePipe
      useValue: DatePipeDateAdapter.createCustomMatDateFormats('dd/MM/yyyy')
    }
  ]
})
export class FilterComponent implements OnInit, OnChanges, OnDestroy {
  readonly FilterSidePanelComponent = FilterSidePanelComponent;
  @Input() set json(json) {
    if (json?.length) {
      this.assignmentTypeIndex = json
        .map((item) => item.type)
        .indexOf('assignmentType');
      this._json = json;
      this.json$.next(json);
    }
  }

  get json() {
    return this._json;
  }

  @Output()
  close: EventEmitter<any> = new EventEmitter();

  @Output()
  apply: EventEmitter<any> = new EventEmitter();

  @Output()
  reset: EventEmitter<any> = new EventEmitter();

  assignTypes = ['plant', 'userGroup', 'user'];
  assigneeTypeControl = new FormControl('userGroup');
  assigneeType = 'userGroup';
  assignmentTypeIndex: number;
  filteredAssignedToCount: number;
  searchInput = new FormControl('');
  filteredAssignedToData$: Observable<any[]>;
  json$ = new BehaviorSubject([]);
  private _json;
  private onDestroy$ = new Subject();

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.json && changes.json.currentValue) {
      this.json = changes.json.currentValue;
    }
  }

  ngOnInit(): void {
    this.assigneeTypeControl.valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        startWith('userGroup'),
        tap((assigneeType) => {
          this.assigneeType = assigneeType;
          this.searchInput.patchValue('');
        })
      )
      .subscribe();
    this.filteredAssignedToData$ = combineLatest([
      this.searchInput.valueChanges.pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged()
      ),
      this.json$,
      this.assigneeTypeControl.valueChanges.pipe(startWith('userGroup'))
    ]).pipe(
      map(([search, json, assigneeType]) => {
        this.assigneeType = assigneeType;
        search = search.toLowerCase();
        if (this.assigneeType === 'user') {
          return (
            json[this.assignmentTypeIndex]?.items.filter(
              (item) =>
                item.type === 'user' &&
                item.value?.fullName?.toLowerCase().includes(search)
            ) || []
          );
        }
        if (this.assigneeType === 'userGroup') {
          return (
            json[this.assignmentTypeIndex]?.items.filter(
              (item) =>
                item.type === 'userGroup' &&
                item.value?.name?.toLowerCase().includes(search)
            ) || []
          );
        }
      }),
      tap((data) => (this.filteredAssignedToCount = data.length))
    );
  }

  closeFilter() {
    this.close.emit();
  }

  applyFilter() {
    this.apply.emit(this.json);
  }
  resetFilter() {
    for (const item of this.json) {
      item.value = '';
      if (item?.hasOwnProperty('startDate')) {
        item.startDate = '';
      }
      if (item?.hasOwnProperty('endDate')) {
        item.endDate = '';
      }
      if (item.itemValue) {
        item.itemValue = '';
      }
    }
    this.reset.emit(this.json);
  }

  checkState() {
    let status = true;
    for (const item of this.json) {
      if (item.value || item.itemValue) {
        if (typeof item.value === 'string') status = false;
        else if (typeof item.value === 'object' && item.value.length !== 0)
          status = false;
      }
    }
    return status;
  }

  dateRangeSelect(item: any) {
    if (item.startDate && item.endDate) {
      let sOffset = new Date(item.startDate).getTimezoneOffset() * 60 * 1000;
      let eOffset = new Date(item.endDate).getTimezoneOffset() * 60 * 1000;
      sOffset > 0 ? (sOffset = -sOffset) : (sOffset = Math.abs(sOffset));
      eOffset > 0 ? (eOffset = -eOffset) : (eOffset = Math.abs(eOffset));
      const startDate = new Date(
        new Date(item.startDate).getTime() + sOffset
      ).toISOString();
      const endDate = new Date(
        new Date(item.endDate).getTime() + eOffset
      ).toISOString();
      item.value = [startDate, endDate];
    } else {
      item.value = [];
    }
  }

  closeSelect(select: MatSelect): void {
    select.openedChange.subscribe((isOpened: boolean) => {
      if (
        !isOpened &&
        (select.value === null || this.isOptionArrayEmpty(select.value))
      ) {
        this.resetSelector();
      }
    });
    select.close();
  }

  resetSelector(): void {
    for (const item of this.json) {
      if (item.itemValue) {
        item.itemValue = '';
      }
    }
    this.reset.emit(this.json);
  }

  isOptionArrayEmpty(options: MatOption[] | any[]): boolean {
    return Array.isArray(options) && options.length === 0;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
