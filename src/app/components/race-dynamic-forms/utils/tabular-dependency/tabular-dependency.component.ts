/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
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

  constructor(private fb: FormBuilder, private cdrf: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.dependencyForm = this.fb.group({
      response: new FormControl(''),
      header: new FormControl('')
    });

    /* this.response.valueChanges.pipe(
      tap((value) => {
        const respSet = this.globalDatasetsData.find(
          (item) => item.name === value
        );
        this.filterByResponseSet$.next(respSet.values.headers);
        this.cdrf.markForCheck();
      })
    ); */

    this.header.valueChanges.pipe(
      tap((header) => {
        const respSet = this.globalDatasetsData.find(
          (item) => item.name === this.response.value
        );
        this.activeQuestion.get('value').setValue({
          // ...this.activeQuestion.get('value'),
          dependsOn: header,
          globalDataset: true,
          fileName: respSet.fileName,
          id: respSet.id
        });
        this.cdrf.markForCheck();
      })
    );
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
    // this.cdrf.markForCheck();
  }

  handleHeaderChange(event: any) {
    const { value: header } = event;
    const respSet = this.globalDatasetsData.find(
      (item) => item.name === this.response.value
    );
    this.activeQuestion.get('value').setValue({
      // ...this.activeQuestion.get('value'),
      dependsOn: header,
      globalDataset: true,
      fileName: respSet.fileName,
      id: respSet.id
    });
    // this.cdrf.markForCheck();
  }
}
