import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableColumn } from 'src/app/interfaces';
import { DateSegmentService } from '../../../shared/components/date-segment/date-segment.service';

@Component({
  selector: 'app-dynamic-filters',
  templateUrl: './dynamic-filters.component.html',
  styleUrls: ['./dynamic-filters.component.scss']
})
export class DynamicFiltersComponent implements OnChanges {
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

  constructor(
    private formBuilder: FormBuilder,
    private dateSegmentService: DateSegmentService
  ) {
    this.filtersForm = this.formBuilder.group({
      filters: this.formBuilder.array([])
    });
  }

  get filters(): FormArray {
    return this.filtersForm.controls['filters'] as FormArray;
  }

  newFilter(column): FormGroup {
    const { name, displayName, filterType } = column;
    let operator, operand;
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
          startDate: operand?.startDate || '',
          endDate: operand?.endDate || ''
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
        operand: [operand || '', Validators.required],
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

  addFilter = (column, index) => {
    this.dropdownReportColumns.splice(index, 1);
    const filter = this.newFilter(column);
    this.filters.push(filter);
  };

  deleteFilteredField(column, index) {
    this.dropdownReportColumns.push({
      displayName: column.displayName,
      filterType: column.filterType,
      name: column.name
    });
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
  }

  prepareAppliedFilters() {
    let operand;
    let operator;
    let filterType;
    let name;
    let displayName;
    for (let index in this.filtersForm.value.filters) {
      let idx = parseInt(index);
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
            let startDateISO = operand.startDate.toISOString();
            let endDateISO = operand.endDate.toISOString();
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
        case 'default':
        // do nothing
      }
      this.filtersApplied.push({
        column: name,
        type: filterType,
        filters: [
          {
            operation: operator || null,
            operand: operand
          }
        ]
      });

      this.appliedFilters.emit({
        filters: this.filtersApplied,
        searchKey: this.searchValue
      });
    }
  }
}
