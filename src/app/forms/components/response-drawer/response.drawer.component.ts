import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  tap
} from 'rxjs/operators';
import { isEqual } from 'lodash-es';

@Component({
  selector: 'app-response-drawer',
  templateUrl: './response.drawer.component.html',
  styleUrls: ['./response.drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponseDrawerComponent implements OnInit {
  public respType: string;
  public responseForm: FormGroup;
  public isFormNotUpdated = true;
  private inputResp: Observable<any>;
  private id: string;
  private formsId: string;

  setmethods = false;

  @Input() set inputResponse(responses: Observable<any>) {
    this.inputResp = responses ? responses : (of([]) as Observable<any>);
  }
  @Input() set formId(id: string) {
    this.formsId = id;
  }

  @Input() set responseType(responseType: string) {
    this.respType = responseType;
  }

  @Input() set activeResponseId(id: string) {
    this.id = id;
  }

  constructor(
    private fb: FormBuilder,
    // private mcqService: McqService,
    private cdrf: ChangeDetectorRef
  ) {}

  openDrawer(): void {
    this.setmethods = true;
  }

  ngOnInit(): void {
    this.responseForm = this.fb.group({
      name: new FormControl(''),
      responses: this.fb.array([])
    });

    this.responses.valueChanges
      .pipe(
        pairwise(),
        debounceTime(500),
        distinctUntilChanged(),
        tap(([prevResp, currResp]) => {
          if (isEqual(prevResp, currResp)) this.isFormNotUpdated = true;
          else if (currResp.find((item) => !item.title))
            this.isFormNotUpdated = true;
          else this.isFormNotUpdated = false;
          this.cdrf.markForCheck();
        })
      )
      .subscribe();

    this.inputResp
      .pipe(
        tap(({ data: input }) => {
          const resp = input.find((item) => item.id === this.id);
          if (resp) {
            if (this.respType === 'globalResponse')
              this.name.patchValue(resp.name);
            resp.values.forEach((val) => {
              this.responses.push(this.fb.group(val));
            });
          }
          this.cdrf.markForCheck();
        })
      )
      .subscribe();
  }

  get responses(): FormArray {
    return this.responseForm.get('responses') as FormArray;
  }

  get name() {
    return this.responseForm.get('name');
  }

  getResponseList() {
    return (this.responseForm.get('responses') as FormArray).controls;
  }

  initResponse = () => {
    this.responses.push(
      this.fb.group({
        title: '',
        color: ''
      })
    );
  };

  deleteResponse = (idx: number) => {
    this.responses.removeAt(idx);
    this.responseForm.markAsDirty();
  };

  submitResponses = () => {};

  keytab(event) {
    const element = event.srcElement.nextElementSibling;

    if (element == null) return;
    else element.focus();
  }

  cancelForm = () => {
    this.setmethods = false;
  };
}
