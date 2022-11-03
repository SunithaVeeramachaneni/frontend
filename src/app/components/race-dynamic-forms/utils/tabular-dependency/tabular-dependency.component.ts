/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-tabular-dependency',
  templateUrl: './tabular-dependency.component.html',
  styleUrls: ['./tabular-dependency.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabularDependencyComponent implements OnInit {
  activeQuestion: any;
  public filterByResponseSet$: BehaviorSubject<any> = new BehaviorSubject([]);
  public dependencyForm: FormGroup;
  globalDatasetsData: any;
  private _globalDatasetsData$: any;

  @Input() set globalDatasetsData$(globalDatasetsData$: any) {
    this._globalDatasetsData$ = globalDatasetsData$;
    globalDatasetsData$.subscribe((data) => {
      console.log(data);
      this.globalDatasetsData = data.data;
    });
  }

  get globalDatasetsData$() {
    return this._globalDatasetsData$;
  }

  @Input() set question(question: any) {
    this.activeQuestion = question;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.dependencyForm = this.fb.group({
      response: new FormControl(''),
      header: new FormControl('')
    });
  }

  get response() {
    return this.dependencyForm.get('response');
  }

  get header() {
    return this.dependencyForm.get('header');
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
