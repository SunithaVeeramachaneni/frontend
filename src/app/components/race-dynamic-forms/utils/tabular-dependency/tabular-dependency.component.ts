/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-tabular-dependency',
  templateUrl: './tabular-dependency.component.html',
  styleUrls: ['./tabular-dependency.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabularDependencyComponent implements OnInit {
  public filterByResponseSet$: BehaviorSubject<any> = new BehaviorSubject([]);
  public dependencyForm: FormGroup = this.fb.group({
    response: new FormControl(''),
    header: new FormControl('')
  });
  globalDatasets: any;
  private _globalDatasetsData$;
  private _sections;
  private _sectionPosition;
  private _question;

  @Input() set globalDatasetsData$(globalDatasetsData$: Observable<any>) {
    this._globalDatasetsData$ = globalDatasetsData$;
    globalDatasetsData$.subscribe((data) => {
      this.globalDatasets = data.data;
    });
  }
  get globalDatasetsData$() {
    return this._globalDatasetsData$;
  }

  @Input() set sectionPosition(data) {
    this._sectionPosition = data;
  }
  get sectionPosition() {
    return this._sectionPosition;
  }

  @Input() set sections(data) {
    this._sections = data;
  }
  get sections() {
    return this._sections;
  }

  @Input() set question(question: any) {
    this._question = question;
    this.updateDependencyForm();
  }
  get question() {
    return this._question;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  get response() {
    return this.dependencyForm.get('response');
  }

  get header() {
    return this.dependencyForm.get('header');
  }

  updateDependencyForm() {
    const { fileName, dependsOn: header = '' } = this.question.value.value;
    const response = fileName ? fileName.split('.')[0] : '';
    const obj = {
      response,
      header
    };
    if (response && header) {
      this.handleResponseChange({ value: response });
    }
    this.dependencyForm.patchValue(obj);
  }

  handleResponseChange(event: any) {
    const { value } = event;
    // TODO : find globalDataset based on id not based on name
    const globalDataset = this.globalDatasets.find(
      (item) => item.name === value
    );
    const selectedQuestion = this.question.value;
    let dependencyResponseTypes = [];
    this.sections.forEach((section) => {
      const { questions, position } = section.value;
      const dependencies = questions
        .map((question) => {
          if (
            question.fieldType === 'DD' &&
            question.value.id === globalDataset.id &&
            question.value.globalDataset &&
            position <= this.sectionPosition &&
            (question.position < selectedQuestion.position ||
              position < this.sectionPosition)
          ) {
            return question.value.responseType;
          }
        })
        .filter((responseType) => responseType);
      dependencyResponseTypes = dependencyResponseTypes.concat(dependencies);
    });
    this.filterByResponseSet$.next(dependencyResponseTypes);
  }

  handleHeaderChange(event: any) {
    const { value: header } = event;
    const respSet = this.globalDatasets.find(
      (item) => item.name === this.response.value
    );
    this.question.get('value').setValue({
      dependsOn: header,
      globalDataset: true,
      fileName: respSet.fileName,
      id: respSet.id
    });
  }
}
