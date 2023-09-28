import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { slideInOut } from 'src/app/animations';
import { ResponseSetService } from 'src/app/components/master-configurations/response-set/services/response-set.service';
import {
  RDF_DEFAULT_COLUMNS,
  RDF_DEFAULT_COLUMN_CONFIG
} from 'src/app/components/race-dynamic-form/race-dynamic-forms.constants';
import { columnConfiguration } from 'src/app/interfaces/columnConfiguration';
import { ColumnConfigurationService } from '../../services/column-configuration.service';
import { metadataFlatModuleNames } from 'src/app/app.constants';
import { Column } from '@innovapptive.com/dynamictable/lib/interfaces';
@Component({
  selector: 'app-column-configuration-slider',
  templateUrl: './column-configuration-slider.component.html',
  styleUrls: ['./column-configuration-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class ColumnConfigurationSliderComponent implements OnInit {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Input() moduleName: string;
  freezeIndexTill: number;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  ghostLoading = new Array(15).fill(0).map((v, i) => i);
  additionalColumns: columnConfiguration[] = [
    {
      columnId: 'test1',
      columnName: 'Test 1',
      disabled: false,
      selected: false,
      draggable: true,
      default: false
    },
    {
      columnId: 'test2',
      columnName: 'Test 2',
      disabled: false,
      selected: false,
      draggable: true,
      default: false
    },
    {
      columnId: 'test3',
      columnName: 'Test 3',
      disabled: false,
      selected: false,
      draggable: true,
      default: false
    },
    {
      columnId: 'test4',
      columnName: 'Test 4',
      disabled: false,
      selected: false,
      draggable: true,
      default: false
    },
    {
      columnId: 'test5',
      columnName: 'Test 5',
      disabled: false,
      selected: false,
      draggable: true,
      default: false
    }
  ];
  allColumns: columnConfiguration[] = [
    ...RDF_DEFAULT_COLUMNS,
    ...this.additionalColumns
  ];
  allComplete: boolean = false;
  constructor(
    private responseSetService: ResponseSetService,
    private columnConfigService: ColumnConfigurationService,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchResponseSetByModuleName().subscribe();
    //This function is based on the assumption that non draggable fields will always be set above the draggable fields
    this.freezeIndexTill = this.allColumns.findIndex(
      (column) => column.draggable
    );
  }

  cancelForm() {
    this.slideInOut.emit('in');
  }

  updateAllComplete() {
    this.allComplete = this.allColumns.every((t) => t.selected);
  }

  someComplete(): boolean {
    return (
      this.allColumns.filter((t) => t.selected).length > 0 && !this.allComplete
    );
  }
  resetToDefault() {
    this.allColumns = [...RDF_DEFAULT_COLUMNS, ...this.additionalColumns];
    this.allColumns.map((column) => {
      if (column.default) {
        column.selected = true;
      } else {
        column.selected = false;
      }
      return column;
    });
  }
  fetchResponseSetByModuleName = () => {
    return this.responseSetService
      .fetchResponseSetByModuleName$(this.moduleName)
      .pipe(
        /////////////////////////////////////////////////////////////////
        delay(3000), // Remove this before merge
        tap((data) => {
          ///////////////////////////////////////////////////
          this.additionalColumns = data?.map((item) =>
            this.columnConfigService.getColumnConfigFromAdditionalDetails(item)
          );
          this.allColumns = [...RDF_DEFAULT_COLUMNS, ...this.additionalColumns];
          this.isLoading$.next(false);
          this.cdrf.detectChanges();
        })
      );
  };
  setAll(completed: boolean) {
    this.allComplete = completed;
    this.allColumns.map((column) => {
      if (!column.disabled) {
        column.selected = completed;
      }
      return column;
    });
  }

  //drop event after the elements which are not set as draggable
  drop(event: CdkDragDrop<string[]>) {
    if (event.currentIndex < this.freezeIndexTill) {
      event.currentIndex = this.freezeIndexTill;
    }
    const prevIndex = event.previousIndex;
    const currIndex = event.currentIndex;
    this.allColumns = this.array_move(this.allColumns, prevIndex, currIndex);
  }
  array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      let k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  }
  getModuleDefaultDynamicTableConfig() {
    switch (this.moduleName) {
      case metadataFlatModuleNames.RACE_DYNAMIC_FORMS:
        return RDF_DEFAULT_COLUMN_CONFIG;
      default:
        return [];
    }
  }
  onSave() {
    const dynamicTableColumns =
      this.columnConfigService.getDynamicColumnsFromColumnConfig(
        this.getModuleDefaultDynamicTableConfig(),
        this.allColumns.filter((column) => column.selected)
      );
    this.setColumnConfigurationToDynamicTable(dynamicTableColumns);
    this.slideInOut.emit('in');
  }
  setColumnConfigurationToDynamicTable(dynamicTableColumns: Column[]) {
    this.columnConfigService.moduleColumnConfiguration$.next(
      dynamicTableColumns
    );
  }
  ngOnDestroy(): void {
    this.columnConfigService.moduleColumnConfiguration$.next(null);
  }
}
