/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-add-filter',
  templateUrl: './add-filter.component.html',
  styleUrls: ['./add-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddFilterComponent implements OnInit {
  @Output() filterDetails: EventEmitter<any> = new EventEmitter<any>();
  selectedDependencyResponseType: string;
  globalDataset: any;
  filterForm: FormGroup;
  dependencyResponseTypes: [];
  private _filterRequiredInfo;
  @Input() set filterRequiredInfo(data) {
    this._filterRequiredInfo = data;
  }
  get filterRequiredInfo() {
    return this._filterRequiredInfo;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const { globalDataset, selectedQuestion, questionControl, questions } =
      this.filterRequiredInfo;
    this.globalDataset = globalDataset;
    const {
      dependsOn = '',
      location = false,
      latitudeColumn = '',
      longitudeColumn = '',
      radius = '',
      pins = 0,
      autoSelectColumn = ''
    } = selectedQuestion.value;
    this.selectedDependencyResponseType = dependsOn;

    this.filterForm = this.fb.group({
      dependsOn: '',
      location: false,
      latitudeColumn: '',
      longitudeColumn: '',
      radius: '',
      pins: 0,
      autoSelectColumn: this.fb.array([])
    });

    this.filterForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((data) =>
        this.filterDetails.emit({ ...data, questionControl, globalDataset })
      );

    this.dependencyResponseTypes = questions
      .map((question) => {
        if (
          question.fieldType === 'DD' &&
          question.value.globalDataset &&
          question.position < selectedQuestion.position
        ) {
          return question.value.responseType;
        }
      })
      .filter((responseType) => responseType);

    this.filterForm.patchValue(
      {
        dependsOn,
        location,
        latitudeColumn,
        longitudeColumn,
        radius,
        pins,
        autoSelectColumn
      },
      { emitEvent: false }
    );
  }

  getAutoSelectColumnFields(form) {
    console.log(form);
    return form.controls.autoSelectColumn.controls;
  }
}
