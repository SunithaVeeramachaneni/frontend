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
  activeQuestion: any;
  public filterByResponseSet$: BehaviorSubject<any> = new BehaviorSubject([]);
  public dependencyForm: FormGroup = this.fb.group({
    response: new FormControl(''),
    header: new FormControl('')
  });
  globalDatasetsData: any;
  private _globalDatasetsData$: Observable<any>;

  @Input() set globalDatasetsData$(globalDatasetsData$: any) {
    this._globalDatasetsData$ = globalDatasetsData$;
    globalDatasetsData$.subscribe((data) => {
      this.globalDatasetsData = data.data;
    });
  }

  get globalDatasetsData$(): Observable<any> {
    return this._globalDatasetsData$;
  }

  @Input() set question(question: any) {
    this.activeQuestion = question;
    this.updateDependencyForm();
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
    const { fileName, dependsOn: header = '' } =
      this.activeQuestion.value.value;
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
    const respSet = this.globalDatasetsData.find((item) => item.name === value);
    this.filterByResponseSet$.next(respSet.values.headers);
  }

  handleHeaderChange(event: any) {
    const { value: header } = event;
    const respSet = this.globalDatasetsData.find(
      (item) => item.name === this.response.value
    );
    this.activeQuestion.get('value').setValue({
      dependsOn: header,
      globalDataset: true,
      fileName: respSet.fileName,
      id: respSet.id
    });
  }
}
