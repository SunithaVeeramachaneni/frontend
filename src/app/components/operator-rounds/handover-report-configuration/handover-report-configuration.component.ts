import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { slideInOut } from 'src/app/animations';
import { columnConfiguration } from 'src/app/interfaces/columnConfiguration';
import { cloneDeep } from 'lodash-es';
import { ColumnConfigurationService } from 'src/app/forms/services/column-configuration.service';
import { SHR_CONFIGURATION_DATA } from '../operator-rounds.constants';
import { SHRColumnConfiguration } from 'src/app/interfaces/shr-column-configuration';
import { ShrService } from '../services/shr.service';
import { ToastService } from 'src/app/shared/toast';
@Component({
  selector: 'app-handover-report-configuration',
  templateUrl: './handover-report-configuration.component.html',
  styleUrls: ['./handover-report-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class HandoverReportConfigurationComponent implements OnInit, OnDestroy {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() shrConfig: EventEmitter<any> = new EventEmitter();
  @Input() moduleName: string;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  ghostLoading = new Array(15).fill(0).map((v, i) => i);
  additionalColumns: columnConfiguration[] = [];
  allColumns: SHRColumnConfiguration[] = [];
  originalColumns: SHRColumnConfiguration[] = [];
  draggableColumns: SHRColumnConfiguration[] = [];
  saveIsDisabled = true;
  constructor(
    private shrService: ShrService,
    private columnConfigService: ColumnConfigurationService,
    private toastService: ToastService,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.allColumns = SHR_CONFIGURATION_DATA.map((column) => ({ ...column }));
    this.draggableColumns = [...this.allColumns];
    this.originalColumns = cloneDeep(this.allColumns);
    this.fetchCurrentSHRConfiguration().subscribe();
  }

  cancelForm() {
    this.allColumns = cloneDeep(this.originalColumns);
    this.extractDraggableColumns();
    this.updateAllComplete('');
    this.saveIsDisabled = true;
    this.slideInOut.emit('in');
    this.shrConfig.emit(this.originalColumns);
  }

  updateAllComplete(columnId) {
    this.saveIsDisabled = false;

    if (columnId.length > 0) {
      this.draggableColumns.map((item) => {
        if (item.columnId === columnId) {
          item.content?.map((val) => {
            val.selected = item.selected;
            return val;
          });
        }
        return item;
      });
    }

    if (this.draggableColumns) this.allColumns = [...this.draggableColumns];
  }

  updateSubColumn(columnId) {
    this.saveIsDisabled = false;

    if (columnId.length > 0) {
      this.draggableColumns.map((item) => {
        let value = true;
        if (item.columnId === columnId) {
          item.content?.map((val) => {
            if (!val.selected) value = false;
            return val;
          });
          item.selected = value;
        }
        return item;
      });
    }
    if (this.draggableColumns) this.allColumns = [...this.draggableColumns];
  }

  fetchCurrentSHRConfiguration = () =>
    this.shrService.getSHRConfiugration$().pipe(
      tap((data) => {
        this.allColumns = data;
        this.draggableColumns = this.allColumns;
        this.originalColumns = cloneDeep(this.allColumns);
        this.saveIsDisabled = true;
        this.isLoading$.next(false);
        this.shrConfig.emit(this.originalColumns);
        this.cdrf.detectChanges();
      })
    );

  extractDraggableColumns() {
    this.draggableColumns = this.allColumns;
  }

  //drop event after the elements which are not set as draggable
  drop(event: CdkDragDrop<string[]>) {
    this.saveIsDisabled = false;

    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(
        this.draggableColumns,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  dropSub(event: CdkDragDrop<string[]>, columnName: string) {
    const prevIndex = event.previousIndex;
    const currIndex = event.currentIndex;
    const targetListIndex = this.draggableColumns.findIndex(
      (column) => column.columnName === columnName
    );

    this.draggableColumns[targetListIndex].content = this.arrayMove(
      this.draggableColumns[targetListIndex].content,
      prevIndex,
      currIndex
    );
  }
  arrayMove(arr, oldIndex, newIndex) {
    if (newIndex >= arr.length) {
      let k = newIndex - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
  }

  onSave() {
    this.saveIsDisabled = true;
    this.allColumns = [...this.draggableColumns];
    this.shrService
      .updateSHRConfiguration$(this.allColumns)
      .subscribe((response) => {
        if (Object.keys(response).length) {
          this.columnConfigService.isLoadingColumns$.next(true);
          this.toastService.show({
            type: 'success',
            text: 'SHR Configuration Stored Successfully'
          });
        } else {
          this.saveIsDisabled = false;
          this.toastService.show({
            type: 'warning',
            text: 'Unable to store SHR configuration'
          });
        }
        this.columnConfigService.isLoadingColumns$.next(false);
        this.slideInOut.emit('in');
        this.shrConfig.emit(this.allColumns);
      });
  }

  ngOnDestroy(): void {
    this.columnConfigService.moduleColumnConfiguration$.next(null);
    this.columnConfigService.isLoadingColumns$.next(true);
  }
}
