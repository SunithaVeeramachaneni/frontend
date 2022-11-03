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
  public globalResponseSet: any;
  activeQuestion: any;
  public filterByResponseSet$: BehaviorSubject<any> = new BehaviorSubject([]);
  public dependencyForm: FormGroup;

  @Input() set globalResponse(globalResponse: any) {
    this.globalResponseSet = globalResponse ? globalResponse : ([] as any);
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

    this.response.valueChanges.pipe(
      tap((value) => {
        const respSet = this.globalResponseSet.find(
          (item) => item.name === value
        );
        this.filterByResponseSet$.next(respSet.values.headers);
        this.cdrf.markForCheck();
      })
    );

    this.header.valueChanges.pipe(
      tap((header) => {
        const respSet = this.globalResponseSet.find(
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
}
