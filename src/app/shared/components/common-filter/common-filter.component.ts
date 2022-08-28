import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { uniqBy } from 'lodash-es';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFilterService } from './common-filter.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TableColumn } from 'src/app/interfaces';
import { DateSegmentService } from '../date-segment/date-segment.service';
import { debounce } from 'ts-debounce';
@Component({
  selector: 'app-common-filter',
  templateUrl: './common-filter.component.html',
  styleUrls: ['./common-filter.component.scss']
})
export class CommonFilterComponent implements OnChanges {
  @Input() showOverdueList;
  @Input() filtersApplied;
  @Input() priorityList;
  @Input() kitStatusList;
  @Input() technicians;
  @Input() reportColumns;
  @Input() filterOptions;
  @Input() title;
  @Output() appliedFilters: EventEmitter<any> = new EventEmitter();

  isPopoverOpen = false;
  isfilterTooltipOpen = [];
  allColumns = [];
  filtersForm: FormGroup;
  dropdownReportColumns = [];

  public searchValue = '';
  public priority = [];
  public showOverdue = '';
  public kitStatus = [];
  public assign = [];
  public resetBtnDisable = true;
  public applyBtnDisable = true;
  public resetdynamicFiltersBtnDisable = true;
  public applydynamicFiltersBtnDisable = true;

  public displayedAssigneeList: any[];
  public filteredOptionsByType = [];

  public operatorType = [];
  public inputValue = [];
  public dateRange: any;
  public dateRangeText: any;
  public customBtnText = 'Select the Date Range';

  debouncedSearchReport = debounce(
    (newValue) => this.searchOrder(newValue),
    2500
  );

  debouncedSearchOrder = debounce(
    (newValue) => this.searchOrder(newValue),
    500
  );

  constructor(
    private formBuilder: FormBuilder,
    private commonFilterService: CommonFilterService,
    private sanitizer: DomSanitizer,
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
            let index = this.dropdownReportColumns.findIndex(
              (column) => column.name === filter.column
            );
            if (index > -1) {
              let displayName = this.dropdownReportColumns[index].displayName;
              this.dropdownReportColumns.splice(index, 1);
              this.filters.push(
                this.newFilter({
                  name: filter.column,
                  displayName: displayName,
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

  getImageSrc = (source: string) => {
    const base64Image = 'data:image/jpeg;base64,' + source;
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
  };

  searchFilter() {
    this.commonFilterService.searchFilter({
      search: this.searchValue,
      priority: this.priority,
      showOverdue: this.showOverdue,
      kitStatus: this.kitStatus,
      assign: this.assign
    });
  }

  selectedFilterValue(selectedValue) {
    if (selectedValue === '' || selectedValue.length === 0) {
      this.resetBtnDisable = true;
      this.applyBtnDisable = true;
    } else {
      this.resetBtnDisable = false;
      this.applyBtnDisable = false;
    }
  }

  searchOrder(newValue) {
    this.commonFilterService.searchFilter({
      search: newValue,
      priority: this.priority,
      showOverdue: this.showOverdue,
      kitStatus: this.kitStatus,
      assign: this.assign
    });
    this.applyFilters();
  }

  arrayUnion = (arr1, arr2, identifier) => {
    const array = [...arr1, ...arr2];
    return uniqBy(array, identifier);
  };

  clearFilter = () => {
    this.resetBtnDisable = true;
    this.applyBtnDisable = true;
  };

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
    if (this.filtersApplied.length === 0) {
      this.resetdynamicFiltersBtnDisable = true;
      this.applydynamicFiltersBtnDisable = true;
    }
    if (this.filtersApplied.length === 0) {
      this.appliedFilters.emit({
        filters: this.filtersApplied,
        searchKey: this.searchValue
      });
    }
  }

  openFilterModal(column: TableColumn, index) {
    this.isfilterTooltipOpen[index] = true;
    this.filteredOptionsByType = this.filterOptions[column.filterType];
  }

  onSave() {
    this.isfilterTooltipOpen.fill(false);
    this.filtersApplied = [];
    this.prepareAppliedFilters();
    this.filtersForm.value.filters.forEach((e) => {
      if (e.displayText !== '') {
        this.resetdynamicFiltersBtnDisable = false;
        this.applydynamicFiltersBtnDisable = false;
      }
    });
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
    }
  }

  applyFilters() {
    this.isPopoverOpen = false;
    this.appliedFilters.emit({
      filters: this.filtersApplied,
      searchKey: this.searchValue
    });
  }

  clearFilters() {
    this.filters.clear();
    this.resetdynamicFiltersBtnDisable = true;
    this.applydynamicFiltersBtnDisable = true;
  }
}
