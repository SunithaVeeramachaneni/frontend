import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  startWith,
  tap
} from 'rxjs/operators';
import { isEqual } from 'lodash-es';

@Component({
  selector: 'app-mcq-response',
  templateUrl: './mcq-response.component.html',
  styleUrls: ['./mcq-response.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class McqResponseComponent implements OnInit {
  @Output() dialogClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  public responseForm: FormGroup;
  public isFormNotUpdated = true;
  private inputQuestion: FormGroup;

  @Input() set question(question: any) {
    this.inputQuestion = question ? question : ({} as any);
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.responseForm = this.fb.group({
      responses: this.fb.array([])
    });

    // if (Array.isArray(this.inputQuestion.get('value').value)) {
    //   console.log('Hit');
    //   this.responses.setValue(this.inputQuestion.get('value').value);
    // } else this.responses.setValue([]);

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

  // initalValue = () => {
  //   setTimeout(() => {
  //     if (Array.isArray(this.inputQuestion.get('value').value)) {
  //       const val = this.inputQuestion.get('value').value;
  //       return ([{
  //         title: val.title,
  //         color: val.color
  //       }])
  //       // this.responses.setValue(this.inputQuestion.get('value').value);
  //     } else this.responses.setValue([]);
  //   });
  // };

  get responses(): FormArray {
    return this.responseForm.get('responses') as FormArray;
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
    this.inputQuestion.get('value').setValue(this.responses.value);
    console.log('final', this.inputQuestion);
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
