/* eslint-disable @typescript-eslint/dot-notation */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TableColumn } from 'src/app/interfaces';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { DateSegmentService } from '../../../shared/components/date-segment/date-segment.service';

@Component({
  selector: 'app-dynamic-filters',
  templateUrl: './dynamic-filters.component.html',
  styleUrls: ['./dynamic-filters.component.scss']
})
export class DynamicFiltersComponent implements OnInit, OnChanges {
  @Input() filtersApplied;
  @Input() reportColumns;
  @Input() filterOptions;
  @Output() appliedFilters: EventEmitter<any> = new EventEmitter();
  public dynamicFilterModalTopPosition;
  public isOpen = true;
  public isfilterTooltipOpen = [];
  public filtersForm: FormGroup;
  public dropdownReportColumns = [];
  public searchValue = '';
  public filteredOptionsByType = [];
  public dateRange: any;
  public customBtnText = 'Select the Date Range';
  addFilterControl = new FormControl();
  reportColumns$: Observable<any[]>;

  constructor(
    private formBuilder: FormBuilder,
    private dateSegmentService: DateSegmentService
  ) {
    this.filtersForm = this.formBuilder.group({
      filters: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.reportColumns$ = this.addFilterControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.displayName)),
      map((value) =>
        value ? this.filter(value) : this.dropdownReportColumns.slice()
      )
    );
  }

  get filters(): FormArray {
    return this.filtersForm.controls['filters'] as FormArray;
  }

  newFilter(column): FormGroup {
    const { name, displayName, filterType } = column;
    let operator;
    let operand;
    if (column.operator) {
      operator = column.operator;
    }
    if (column.operand) {
      operand = column.operand;
    }
    if (filterType === 'daterange') {
      return this.formBuilder.group({
        name: [name, Validators.required],
        displayName: [displayName, Validators.required],
        filterType: [filterType, Validators.required],
        operand: this.formBuilder.group({
          startDate: [operand?.startDate || '', Validators.required],
          endDate: [operand?.endDate || '', Validators.required]
        }),
        operator: [operator || '', Validators.required],
        displayText: [
          operand
            ? operand.startDate.split('T')[0] +
              ' - ' +
              operand.endDate.split('T')[0]
            : ''
        ]
      });
    } else if (filterType === 'single' || filterType === 'multi') {
      return this.formBuilder.group({
        name: [name, Validators.required],
        displayName: [displayName, Validators.required],
        filterType: [filterType, Validators.required],
        operand: [operand || '', Validators.required],
        displayText: [operand || '']
      });
    } else {
      return this.formBuilder.group({
        name: [name, Validators.required],
        displayName: [displayName, Validators.required],
        filterType: [filterType, Validators.required],
        operand: [
          operand || '',
          [Validators.required, WhiteSpaceValidator.whiteSpace]
        ],
        operator: [operator || '', Validators.required],
        displayText: [operand && operator ? operator + ' ' + operand : '']
      });
    }
  }

  removeFilter(i: number) {
    this.filters.removeAt(i);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.filterOptions = changes.filterOptions
      ? changes.filterOptions.currentValue
      : this.filterOptions;
    if (changes.filtersApplied && changes.reportColumns) {
      this.dropdownReportColumns = [];
      this.dropdownReportColumns = changes.reportColumns.currentValue;
      this.filtersApplied = changes.filtersApplied.currentValue;
      while (this.filters.length) this.removeFilter(0);
      if (this.dropdownReportColumns) {
        this.dropdownReportColumns = this.dropdownReportColumns.map(
          (reportColumn) => ({
            displayName: reportColumn.displayName,
            filterType: reportColumn.filterType,
            name: reportColumn.name
          })
        );
      }
      if (this.filtersApplied && this.filtersApplied.length > 0) {
        for (const filter of this.filtersApplied) {
          if (
            this.dropdownReportColumns &&
            this.dropdownReportColumns.length > 0
          ) {
            const index = this.dropdownReportColumns.findIndex(
              (column) => column.name === filter.column
            );
            if (index > -1) {
              const displayname = this.dropdownReportColumns[index].displayName;
              this.dropdownReportColumns.splice(index, 1);
              this.filters.push(
                this.newFilter({
                  name: filter.column,
                  displayName: displayname,
                  filterType: filter.type,
                  operator: filter.filters[0].operation,
                  operand: filter.filters[0].operand
                })
              );
            }
          }
        }
      }
    }
  }

  addFilter = (column) => {
    const index = this.dropdownReportColumns.findIndex(
      (reportColumn) => reportColumn.displayName === column.displayName
    );
    this.dropdownReportColumns.splice(index, 1);
    const filter = this.newFilter(column);
    this.filters.push(filter);
    this.addFilterControl.setValue('');
  };

  deleteFilteredField(column, index) {
    this.dropdownReportColumns.push({
      displayName: column.displayName,
      filterType: column.filterType,
      name: column.name
    });
    this.addFilterControl.setValue('');
    this.filters.removeAt(index);
    this.filtersApplied.splice(index, 1);
    this.appliedFilters.emit({
      filters: this.filtersApplied,
      searchKey: this.searchValue
    });
  }

  openFilterModal(column: TableColumn, index, el) {
    this.isfilterTooltipOpen[index] = true;
    this.filteredOptionsByType = this.filterOptions[column.filterType];

    this.dynamicFilterModalTopPosition = el.y - 85 + 'px';
  }

  onSave() {
    this.isfilterTooltipOpen.fill(false);
    this.filtersApplied = [];
    this.prepareAppliedFilters();
    this.filtersForm.reset(this.filtersForm.getRawValue());
  }

  prepareAppliedFilters() {
    let operand;
    let operator;
    let filterType;
    let name;
    let displayName;
    this.filtersForm.value.filters.forEach((val, idx) => {
      filterType = this.filters.at(idx).get('filterType').value;
      name = this.filters.at(idx).get('name').value;
      displayName = this.filters.at(idx).get('displayName').value;
      switch (filterType) {
        case 'number':
        case 'string':
          operator = this.filters.at(idx).get('operator').value;
          operand = this.filters.at(idx).get('operand').value;
          this.filters
            .at(idx)
            .get('displayText')
            .setValue(operator + ' ' + operand);
          break;
        case 'daterange':
          operator = this.filters.at(idx).get('operator').value;
          operand = this.filters.at(idx).get('operand').value;
          if (operator !== 'custom') {
            const dateFilter =
              this.dateSegmentService.getStartAndEndDate(operator);
            operand = dateFilter;
            this.filters.at(idx).get('displayText').setValue(operator);
          } else if (operator === 'custom') {
            const startDateISO = operand.startDate.toISOString();
            const endDateISO = operand.endDate.toISOString();
            const customDate =
              startDateISO.split('T')[0] + ' - ' + endDateISO.split('T')[0];
            this.filters.at(idx).get('displayText').setValue(customDate);
            operand = {
              startDate: startDateISO,
              endDate: endDateISO
            };
          }
          break;
        case 'single':
        case 'multi':
          operand = this.filters.at(idx).get('operand').value;
          this.filters.at(idx).get('displayText').setValue(operand);
          break;
        case 'default':
        // do nothing
      }
      if (operand) {
        this.filtersApplied.push({
          column: name,
          type: filterType,
          filters: [
            {
              operation: operator || null,
              operand
            }
          ]
        });

        this.appliedFilters.emit({
          filters: this.filtersApplied,
          searchKey: this.searchValue
        });
      }
    });
  }

  displayFn(reportColumn: any): string {
    return reportColumn ? reportColumn.displayName : undefined;
  }

  updateDateRangeValidation(value, filterForm) {
    if (value === 'custom') {
      filterForm.get('operand.startDate').setValidators([Validators.required]);
      filterForm.get('operand.endDate').setValidators([Validators.required]);
    } else {
      filterForm.get('operand.startDate').setValidators([]);
      filterForm.get('operand.endDate').setValidators([]);
    }
    filterForm.get('operand.startDate').updateValueAndValidity();
    filterForm.get('operand.endDate').updateValueAndValidity();
  }

  private filter(value: string) {
    return this.dropdownReportColumns.filter((reportColumn) =>
      reportColumn.displayName.toLowerCase().includes(value.toLowerCase())
    );
  }
}
