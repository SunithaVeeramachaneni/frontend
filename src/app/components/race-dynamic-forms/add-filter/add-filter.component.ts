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
  @Output() updateChildren: EventEmitter<any> = new EventEmitter<any>();
  selectedDependencyResponseType: string;
  globalDataset: any = {};
  filterForm: FormGroup = this.fb.group({
    dependsOn: '',
    children: [[]],
    location: false,
    latitudeColumn: '',
    longitudeColumn: '',
    radius: '',
    pins: 0,
    autoSelectColumn: [[]]
  });
  dependencyResponseTypes: any[] = [];
  radiuses = ['500m', '5000m', '50000m', '500000m'];
  private _globalDatasetsData$;
  private _question;
  private _sections;
  private _sectionPosition;

  @Input() set globalDatasetsData$(data) {
    this._globalDatasetsData$ = data;
  }
  get globalDatasetsData$() {
    return this._globalDatasetsData$;
  }

  @Input() set question(data) {
    this._question = data;
    this.updateFilterForm();
  }
  get question() {
    return this._question;
  }

  @Input() set sectionPosition(data) {
    this._sectionPosition = data;
  }
  get sectionPosition() {
    return this._sectionPosition;
  }

  @Input() set sections(data) {
    this._sections = data;
    this.getDependencyResponseTypes();
  }
  get sections() {
    return this._sections;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.globalDatasetsData$.subscribe(({ data }) => {
      this.globalDataset = data.find(
        (dataset) => dataset.id === this.question.value.value.id
      );
    });

    this.filterForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((data) =>
        this.filterDetails.emit({
          ...data,
          question: this.question
        })
      );
  }

  updateFilterForm() {
    const filterData = this.question.value.value;
    const {
      dependsOn = '',
      children = [],
      location = false,
      latitudeColumn = '',
      longitudeColumn = '',
      radius = '500000m',
      pins = 0,
      autoSelectColumn = []
    } = filterData;
    this.selectedDependencyResponseType = dependsOn;

    this.filterForm.patchValue(
      {
        dependsOn,
        children,
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

  getDependencyResponseTypes() {
    const selectedQuestion = this.question.value;
    this.sections.forEach((section) => {
      const { questions, position } = section.value;
      const dependencies = questions
        .map((question) => {
          if (
            question.fieldType === 'DD' &&
            question.value.globalDataset &&
            position <= this.sectionPosition &&
            (question.position < selectedQuestion.position ||
              position < this.sectionPosition)
          ) {
            return question.value.responseType;
          }
        })
        .filter((responseType) => responseType);
      this.dependencyResponseTypes =
        this.dependencyResponseTypes.concat(dependencies);
    });
  }

  handleFilterChange(event: any) {
    const { value } = event.target as HTMLInputElement;
    const { responseType } = this.question.value.value;
    let allSectionQuestions = [];

    this.sections.forEach((section) => {
      const { questions: que } = section.controls;
      allSectionQuestions = allSectionQuestions.concat(que.controls);
    });

    const updateChildrenQuestions = allSectionQuestions
      .map((question) => {
        const { children = [], responseType: questionResponseType } =
          question.value.value;
        if (value === questionResponseType) {
          if (!children.includes(responseType)) {
            children.push(responseType);
            return { children, question };
          }
        }
      })
      .filter((item) => item);

    this.updateChildren.emit(updateChildrenQuestions);
  }
}
