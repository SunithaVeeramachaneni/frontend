import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { slideInOut } from 'src/app/animations';
import { RDF_DEFAULT_COLUMNS } from 'src/app/components/race-dynamic-form/race-dynamic-forms.constants';
import { columnConfiguration } from 'src/app/interfaces/columnConfiguration';
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
  constructor() {}

  ngOnInit(): void {
    //This function is based on the assumption that non draggable fields will always be set above the draggable fields
    this.freezeIndexTill = this.allColumns.findIndex(
      (column) => column.draggable
    );
  }
  cancelForm() {
    this.slideInOut.emit('in');
  }

  allComplete: boolean = false;

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
}
