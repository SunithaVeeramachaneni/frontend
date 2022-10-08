import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  startWith,
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

  public isGlobalResp: boolean;
  public responseForm: FormGroup;
  public isFormNotUpdated = true;
  private inputResp: Observable<any>;
  private respType: string;
  private id: string;

  @Input() set inputResponse(responses: Observable<any>) {
    this.inputResp = responses ? responses : (of([]) as Observable<any>);
  }

  @Input() set responseType(responseType: string) {
    this.respType = responseType;
    this.isGlobalResp = responseType === 'globalResponse' ? true : false;
    console.log(this.isGlobalResp);
  }

  constructor(private fb: FormBuilder, private mcqService: McqService) {}

  ngOnInit(): void {
    this.responseForm = this.fb.group({
      name: new FormControl(''),
      responses: this.fb.array([])
    });

    this.inputResp
      .pipe(
        tap((input) => {
          if (!Array.isArray(input)) {
            this.id = input.id;
            input.values.forEach((val) => {
              this.responses.push(this.fb.group(val));
            });
          }
        })
      )
      .subscribe();

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
    if (this.id) {
      this.mcqService
        .updateResponse$(this.id, this.responses.value)
        .subscribe((newResp) => {
          console.log('Updated', newResp);
          this.inputResp.pipe(
            tap(() => ({
              id: newResp.id,
              values: newResp.values,
              name: this.name.value
            }))
          );
        });
    } else {
      this.mcqService
        .createResponse$({
          type: this.respType,
          values: this.responses.value,
          name: this.name.value
        })
        .subscribe((newResp) => {
          console.log('Created', newResp);
          this.inputResp.pipe(
            tap((oldResp) => {
              const latest = oldResp.push({
                id: newResp.id,
                values: newResp.values,
                name: this.name.value
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
