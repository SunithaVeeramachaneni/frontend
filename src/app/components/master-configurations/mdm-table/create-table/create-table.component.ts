import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import {
  pairwise,
  debounceTime,
  distinctUntilChanged,
  tap
} from 'rxjs/operators';
import { isEqual } from 'lodash-es';
import { timer } from 'rxjs';
interface Response {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-create-table',
  templateUrl: './create-table.component.html',
  styleUrls: ['./create-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTableComponent implements OnInit {
  @ViewChildren('columnInfo')
  private columnInfo: QueryList<ElementRef>;
  isFav: boolean;
  public columnForm: FormGroup;
  public isColumnFormUpdated = false;
  responses: Response[] = [
    { value: 'text-0', viewValue: 'Text' },
    { value: 'number-1', viewValue: 'Number' },
    { value: 'checkbox-3', viewValue: 'Checkbox' }
  ];
  constructor(private fb: FormBuilder) {}

  favoriteToggle = () => {
    this.isFav = !this.isFav;
  };
  ngOnInit(): void {
    this.columnForm = this.fb.group({
      columns: this.fb.array([])
    });
    this.columnForm.valueChanges
      .pipe(
        pairwise(),
        debounceTime(500),
        distinctUntilChanged(),
        tap(([prev, curr]) => {
          if (isEqual(prev, curr)) this.isColumnFormUpdated = false;
          else this.isColumnFormUpdated = true;
          // this.cdrf.markForCheck();
        })
      )
      .subscribe();
  }
  addColumn(index: number) {
    this.columns.push(
      this.fb.group({
        columnName: ['asdf'],
        responseType: ['adf']
      })
    );

    console.log('Add Column: ', this.columns);

    timer(0).subscribe(() =>
      this.columnInfo.toArray()[index]?.nativeElement.focus()
    );
  }
  getColumnCount() {
    return this.columnInfo.toArray().length;
  }
  get columns(): FormArray {
    return this.columnForm.get('columns') as FormArray;
  }
  deleteColumn = (idx: number) => {
    this.columns.removeAt(idx);
    this.columnForm.markAsDirty();
  };
}
