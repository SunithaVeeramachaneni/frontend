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
import { McqService } from './mcq.service';

@Component({
  selector: 'app-mcq-response',
  templateUrl: './mcq-response.component.html',
  styleUrls: ['./mcq-response.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class McqResponseComponent implements OnInit {
  @Output() dialogClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  public respType: string;
  public responseForm: FormGroup;
  public isFormNotUpdated = true;
  private inputResp: Observable<any>;
  private id: string;

  @Input() set inputResponse(responses: Observable<any>) {
    this.inputResp = responses ? responses : (of([]) as Observable<any>);
  }

  @Input() set responseType(responseType: string) {
    this.respType = responseType;
  }

  @Input() set activeResponseId(id: string) {
    this.id = id;
  }

  constructor(
    private fb: FormBuilder,
    private mcqService: McqService,
    private cdrf: ChangeDetectorRef
  ) {}

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
        })
      )
      .subscribe();

    this.inputResp
      .pipe(
        tap((input) => {
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
  };

  submitResponses = () => {
    if (this.id !== '-1') {
      this.mcqService
        .updateResponse$(this.id, {
          id: this.id,
          values: this.responses.value,
          name: this.name.value
        })
        .subscribe(() => {
          this.inputResp.pipe(
            tap((oldResp) => {
              const latest = oldResp.map((resp) => {
                let cur = resp;
                if (resp.id === this.id) {
                  cur = {
                    id: this.id,
                    values: this.responses.value,
                    name: this.name.value
                  };
                }
                return cur;
              });
              return latest;
            })
          );
        });
    } else {
      this.mcqService
        .createResponse$({
          type: this.respType,
          values: this.responses.value,
          name:
            this.respType === 'globalResponse' && !this.name.value
              ? 'Untitled'
              : this.name.value
        })
        .subscribe((newResp) => {
          this.inputResp.pipe(
            tap((oldResp) => {
              const latest = oldResp.push({
                id: newResp.id,
                values: newResp.values,
                name:
                  this.respType === 'globalResponse' && !this.name.value
                    ? 'Untitled'
                    : this.name.value
              });
              return latest;
            })
          );
        });
    }
    this.dialogClose.emit(false);
  };

  keytab(event) {
    const element = event.srcElement.nextElementSibling;

    if (element == null) return;
    else element.focus();
  }

  cancelForm = () => {
    this.dialogClose.emit(false);
  };
}
