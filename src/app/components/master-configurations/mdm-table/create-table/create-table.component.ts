import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import {
  pairwise,
  debounceTime,
  distinctUntilChanged,
  tap
} from 'rxjs/operators';
import { isEqual } from 'lodash-es';
import { timer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeleteColumnModalComponent } from '../delete-column-modal/delete-column-modal.component';
interface Response {
  value: string;
  viewValue: string;
}

import { masterDataResponseTypesMock } from '../masterDataResponseTypes.mock';
import { Location } from '@angular/common';
import { MdmTableService } from '../services/mdm-table.service';

@Component({
  selector: 'app-create-table',
  templateUrl: './create-table.component.html',
  styleUrls: ['./create-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTableComponent implements OnInit {
  public deleteColumn: boolean;
  masterConfiguration: FormGroup;
  columnTypes = {
    all: {},
    masterData: []
  };

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private location: Location,
    private mdmTableService: MdmTableService
  ) {
    this.masterConfiguration = this.fb.group({
      tableName: '',
      columns: this.fb.array([])
    });
    this.addColumn();
  }

  getNewColumn() {
    const defaultColumn = this.fb.group({
      displayName: '',
      columnType: 'TA',
      isKeyField: false
    });
    return defaultColumn;
  }

  get columns() {
    return this.masterConfiguration.get('columns') as FormArray;
  }

  get columnCount() {
    return this.columns.length;
  }

  addColumn() {
    this.columns.push(this.getNewColumn());
  }

  removeColumn(index: number) {
    const dialogRef = this.dialog.open(DeleteColumnModalComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.columns.removeAt(index);
      }
    });
  }

  onSubmit() {
    console.log(this.masterConfiguration.value);
  }

  isKeyFieldToggle(i: number) {
    const column = this.columns.at(i);
    column.patchValue({
      isKeyField: !column.get('isKeyField').value
    });
    console.log(column.get('isKeyField').value);
  }

  cancel() {
    this.location.back();
  }

  ngOnInit(): void {
    this.columnTypes = masterDataResponseTypesMock;
    this.mdmTableService.mdmTables$.subscribe((masterDataTables) => {
      this.columnTypes.masterData = this.columnTypes.masterData.slice(0, 3);
      for (const table of masterDataTables) {
        this.columnTypes.masterData.push({
          label: table.tableName,
          tableUID: table.tableUID
        });
      }
      console.log('Column Types: ', this.columnTypes);
    });
  }

  // @ViewChildren('columnInfo')
  // private columnInfo: QueryList<ElementRef>;
  // isFav: boolean;
  // public columnForm: FormGroup;
  // public isColumnFormUpdated = false;
  // responses: Response[] = [
  //   { value: 'text-0', viewValue: 'Text' },
  //   { value: 'number-1', viewValue: 'Number' },
  //   { value: 'checkbox-3', viewValue: 'Checkbox' }
  // ];
  // constructor(private fb: FormBuilder) {}
  // favoriteToggle = () => {
  //   this.isFav = !this.isFav;
  // };
  // ngOnInit(): void {
  //   this.columnForm = this.fb.group({
  //     columns: this.fb.array([])
  //   });
  //   this.columnForm.valueChanges
  //     .pipe(
  //       pairwise(),
  //       debounceTime(500),
  //       distinctUntilChanged(),
  //       tap(([prev, curr]) => {
  //         if (isEqual(prev, curr)) this.isColumnFormUpdated = false;
  //         else this.isColumnFormUpdated = true;
  //         // this.cdrf.markForCheck();
  //       })
  //     )
  //     .subscribe();
  // }
  // addColumn(index: number) {
  //   this.columns.push(
  //     this.fb.group({
  //       columnName: ['asdf'],
  //       responseType: ['adf']
  //     })
  //   );
  //   console.log('Add Column: ', this.columns);
  //   timer(0).subscribe(() =>
  //     this.columnInfo.toArray()[index]?.nativeElement.focus()
  //   );
  // }
  // getColumnCount() {
  //   return this.columnInfo.toArray().length;
  // }
  // get columns(): FormArray {
  //   return this.columnForm.get('columns') as FormArray;
  // }
  // deleteColumn = (idx: number) => {
  //   this.columns.removeAt(idx);
  //   this.columnForm.markAsDirty();
  // };
}
