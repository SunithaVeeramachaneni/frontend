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
  additionalColumns: columnConfiguration[] = [];
  allColumns: columnConfiguration[] = [];
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
        tap((data) => {
          this.additionalColumns = data?.map((item) =>
            this.columnConfigService.getColumnConfigFromAdditionalDetails(
              item,
              false
            )
          );
          this.columnConfigService.setAllColumnConfigurations([
            ...RDF_DEFAULT_COLUMNS,
            ...this.additionalColumns
          ]);
          this.allColumns =
            this.columnConfigService.getAllColumnConfigurations();
          this.columnConfigService.setUserColumnConfigByModuleName(
            this.moduleName
          );
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

  onSave() {
    const columnIds = this.allColumns.map((column) => {
      if (column.selected) {
        return column.columnId;
      }
    });
    this.columnConfigService.setUserColumnConfigurationByModule(
      this.moduleName,
      columnIds
    );
    this.columnConfigService.isLoadingColumns$.next(true);
    this.columnConfigService.setUserColumnConfigByModuleName(this.moduleName);
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
