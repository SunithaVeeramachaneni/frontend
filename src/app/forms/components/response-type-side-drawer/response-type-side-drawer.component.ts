import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { isEqual } from 'lodash-es';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  tap
} from 'rxjs/operators';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-response-type-side-drawer',
  templateUrl: './response-type-side-drawer.component.html',
  styleUrls: ['./response-type-side-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponseTypeSideDrawerComponent implements OnInit {
  @Output() setSliderValues: EventEmitter<any> = new EventEmitter();
  @Input() question;
  sliderOpenState$: Observable<boolean>;
  multipleChoiceOpenState$: Observable<boolean>;
  public responseForm: FormGroup;
  public isFormNotUpdated = true;

  sliderOptions = {
    value: 0,
    min: 0,
    max: 100,
    increment: 1
  };
  constructor(
    private formService: FormService,
    private fb: FormBuilder,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sliderOpenState$ = this.formService.sliderOpenState$;
    this.multipleChoiceOpenState$ = this.formService.multiChoiceOpenState$;
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
    this.responseForm.markAsDirty();
  };

  submitResponses = () => {
    this.formService.setMultiChoiceOpenState(false);
  };

  keytab(event) {
    const element = event.srcElement.nextElementSibling;

    if (element == null) return;
    else element.focus();
  }

  cancelResponse = () => {
    this.formService.setMultiChoiceOpenState(false);
  };

  applySliderOptions(values) {
    this.setSliderValues.emit(values);
    this.formService.setsliderOpenState(false);
  }

  cancelSlider = () => {
    this.formService.setsliderOpenState(false);
  };
}
