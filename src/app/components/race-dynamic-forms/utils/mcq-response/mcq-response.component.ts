import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  pairwise,
  tap
} from 'rxjs/operators';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { isEqual } from 'lodash-es';

@Component({
  selector: 'app-mcq-response',
  templateUrl: './mcq-response.component.html',
  styleUrls: ['./mcq-response.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class McqResponseComponent implements OnInit {
  public responseForm: FormGroup;
  public isFormNotUpdated = true;
  private inputQuestion: any;

  @Input() set question(question: any) {
    this.inputQuestion = question ? question : ({} as any);
    console.log('inital', question);
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.responseForm = this.fb.group({
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
  }

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
  };

  keytab(event) {
    const element = event.srcElement.nextElementSibling;

    if (element == null) return;
    else element.focus();
  }
}
