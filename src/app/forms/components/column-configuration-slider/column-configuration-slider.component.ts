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
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { slideInOut } from 'src/app/animations';
import { ResponseSetService } from 'src/app/components/master-configurations/response-set/services/response-set.service';
import { columnConfiguration } from 'src/app/interfaces/columnConfiguration';
import { ColumnConfigurationService } from '../../services/column-configuration.service';
import { Column } from '@innovapptive.com/dynamictable/lib/interfaces';
import { UsersService } from 'src/app/components/user-management/services/users.service';
import { ToastService } from 'src/app/shared/toast';
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
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  ghostLoading = new Array(15).fill(0).map((v, i) => i);
  additionalColumns: columnConfiguration[] = [];
  allColumns: columnConfiguration[] = [];
  staticColumns: columnConfiguration[] = [];
  draggableColumns: columnConfiguration[] = [];
  allComplete: boolean = false;
  constructor(
    private userService: UsersService,
    private responseSetService: ResponseSetService,
    private columnConfigService: ColumnConfigurationService,
    private toastService: ToastService,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchResponseSetByModuleName().subscribe();
    //This function is based on the assumption that non draggable fields will always be set above the draggable fields
  }

  cancelForm() {
    this.slideInOut.emit('in');
  }

  updateAllComplete() {
    this.allColumns = [...this.staticColumns, ...this.draggableColumns];
    this.allComplete = this.allColumns.every((t) => t.selected);
  }

  someComplete(): boolean {
    return (
      this.allColumns.filter((t) => t.selected).length > 0 && !this.allComplete
    );
  }
  resetToDefault() {
    this.allColumns = [
      ...this.columnConfigService.getModuleDefaultColumnConfig(this.moduleName),
      ...this.additionalColumns
    ];
    this.allColumns.map((column) => {
      if (column.default) {
        column.selected = true;
      } else {
        column.selected = false;
      }
      return column;
    });
    this.extractDraggableColumns();
    this.extractStaticColumns();
    this.updateAllComplete();
  }
  fetchResponseSetByModuleName = () => {
    return this.responseSetService.fetchResponseSetByModuleName$().pipe(
      tap((data) => {
        this.additionalColumns = data[this.moduleName]?.map((item) =>
          this.columnConfigService.getColumnConfigFromAdditionalDetails(
            item,
            false
          )
        );
        this.columnConfigService.setSelectedColumnsFilterData(data);
        this.columnConfigService.setAllModuleFiltersAndColumns(data);
        this.allColumns = this.columnConfigService.getAllColumnConfigurations(
          this.moduleName
        );
        this.extractStaticColumns();
        this.extractDraggableColumns();
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
  extractStaticColumns() {
    this.staticColumns = this.allColumns.filter((column) => column.disabled);
  }
  extractDraggableColumns() {
    this.draggableColumns = this.allColumns.filter(
      (column) => !column.disabled
    );
  }

  //drop event after the elements which are not set as draggable
  drop(event: CdkDragDrop<string[]>) {
    const prevIndex = event.previousIndex;
    const currIndex = event.currentIndex;
    this.draggableColumns = this.array_move(
      this.draggableColumns,
      prevIndex,
      currIndex
    );
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
    this.allColumns = [...this.staticColumns, ...this.draggableColumns];
    const columnIds = this.allColumns.reduce((acc, column) => {
      if (column.selected) {
        acc.push(column.columnId);
      }
      return acc;
    }, []);
    this.columnConfigService.setUserColumnConfigurationByModule(
      this.moduleName,
      columnIds
    );
    this.userService
      .updateUserPreferences$(
        {
          columnConfigurations: JSON.stringify(
            this.columnConfigService.getUserColumnConfiguration()
          )
        },
        { displayToast: false, failureResponse: {} }
      )
      .subscribe((response) => {
        if (Object.keys(response).length) {
          this.columnConfigService.isLoadingColumns$.next(true);
          this.toastService.show({
            type: 'success',
            text: 'Column Configuration Stored Successfully'
          });
          this.columnConfigService.updateUserColumnConfig(this.moduleName);
          this.columnConfigService.updateFilterConfiguration();
        } else {
          this.toastService.show({
            type: 'warning',
            text: 'Unable to store column configuration'
          });
        }
        this.columnConfigService.isLoadingColumns$.next(false);
        this.slideInOut.emit('in');
      });
  }

  ngOnDestroy(): void {
    this.columnConfigService.moduleColumnConfiguration$.next(null);
    this.columnConfigService.isLoadingColumns$.next(true);
  }
}
