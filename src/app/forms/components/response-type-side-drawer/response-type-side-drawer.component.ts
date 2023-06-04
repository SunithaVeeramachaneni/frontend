import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { isEqual } from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  takeUntil,
  tap
} from 'rxjs/operators';
import {
  NumberRangeMetadata,
  RangeSelectorState,
  ResponseTypeOpenState,
  SliderSelectorState
} from 'src/app/interfaces';
import { FormService } from '../../services/form.service';
import { ToastService } from 'src/app/shared/toast';

@Component({
  selector: 'app-response-type-side-drawer',
  templateUrl: './response-type-side-drawer.component.html',
  styleUrls: ['./response-type-side-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponseTypeSideDrawerComponent implements OnInit, OnDestroy {
  @Input() formId;

  @Output() setSliderValues: EventEmitter<any> = new EventEmitter<any>();

  @Output() responseTypeHandler: EventEmitter<any> = new EventEmitter<any>();
  @Output() rangeSelectionHandler: EventEmitter<any> = new EventEmitter<any>();

  @Input() question;
  sliderOpenState$: Observable<SliderSelectorState>;
  multipleChoiceOpenState$: Observable<ResponseTypeOpenState>;
  rangeSelectorOpenState$: Observable<RangeSelectorState>;

  responseId = '';
  respType = '';

  public responseForm: FormGroup;
  public rangeMetadataForm: FormGroup;

  public isFormNotUpdated = true;
  multipleChoiceOpenState = false;
  rangeSelectorOpenState: RangeSelectorState = {
    isOpen: false,
    questionId: '',
    rangeMetadata: {} as NumberRangeMetadata
  };
  sliderOpenState: SliderSelectorState = {
    isOpen: false,
    questionId: '',
    value: 'TF'
  };

  sliderOptions = {
    value: 0,
    min: 0,
    max: 100,
    increment: 1
  };

  lowerLimitActions = ['None', 'Warning', 'Alert', 'Note'];
  upperLimitActions = ['None', 'Warning', 'Alert', 'Note'];
  isCreate = true;
  private onDestroy$ = new Subject();

  constructor(
    private formService: FormService,
    private fb: FormBuilder,
    private cdrf: ChangeDetectorRef,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.responseForm = this.fb.group({
      id: new FormControl(''),
      name: new FormControl(''),
      responses: this.fb.array([])
    });

    this.rangeMetadataForm = this.fb.group({
      min: undefined,
      max: undefined,
      minMsg: '',
      maxMsg: '',
      minAction: 'None',
      maxAction: 'None'
    });

    this.sliderOpenState$ = this.formService.sliderOpenState$;
    this.multipleChoiceOpenState$ = this.formService.multiChoiceOpenState$;
    this.rangeSelectorOpenState$ = this.formService.rangeSelectorOpenState$;

    this.multipleChoiceOpenState$.subscribe((state) => {
      this.multipleChoiceOpenState = state.isOpen;
      this.responseId = state.response.id;
      this.cdrf.detectChanges();

      if (state.isOpen) {
        state.response.values = state.response.values || [];
        const responsesArray = [];
        this.isCreate = state.response.values.length ? false : true;
        state.response.values.map((response) => {
          responsesArray.push(this.fb.group(response));
        });
        this.responseForm.setControl(
          'responses',
          this.fb.array(responsesArray || [])
        );
        this.responseForm.patchValue({ id: state.response.id });
        this.isFormNotUpdated = false;
        this.cdrf.detectChanges();
      }
    });

    this.rangeSelectorOpenState$.subscribe((state) => {
      this.rangeSelectorOpenState = state;
      this.cdrf.detectChanges();
      if (state.isOpen) {
        this.rangeMetadataForm.patchValue(state.rangeMetadata);
      }
    });

    this.sliderOpenState$.subscribe((state) => {
      this.sliderOpenState = state;
      this.cdrf.detectChanges();
      if (this.question.value !== 'TF') {
        this.sliderOptions = this.question.value;
      }
    });

    this.responseForm.valueChanges
      .pipe(
        pairwise(),
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap(([prev, curr]) => {
          if (
            isEqual(prev.responses, curr.responses) ||
            curr.responses.length < 1
          )
            this.isFormNotUpdated = true;
          else if (curr.responses.find((item) => !item.title))
            this.isFormNotUpdated = true;
          else this.isFormNotUpdated = false;
          this.cdrf.markForCheck();
        })
      )
      .subscribe();

    this.rangeMetadataForm.valueChanges
      .pipe(
        pairwise(),
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap(([prev, curr]) => {
          if (isEqual(prev, curr)) {
            this.isFormNotUpdated = true;
          } else {
            this.isFormNotUpdated = false;
          }
          if (!curr.min) {
            this.rangeMetadataForm.patchValue({ minAction: 'None' });
          }
          if (!curr.max) {
            this.rangeMetadataForm.patchValue({ maxAction: 'None' });
          }
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
        color: '',
        backgroundColor: ''
      })
    );
  };

  deleteResponse = (idx: number) => {
    this.responses.removeAt(idx);
    this.responseForm.markAsDirty();
  };

  submitResponses = () => {
    let eventType = 'quickResponsesAdd';
    if (this.responseForm.value.id && this.responseForm.value.id.length) {
      eventType = 'quickResponseUpdate';
    }
    this.responseTypeHandler.emit({
      eventType,
      data: this.responseForm.getRawValue(),
      formId: this.formId
    });

    this.multipleChoiceOpenState = false;
    this.formService.setMultiChoiceOpenState({ isOpen: false, response: {} });
  };

  applyBGColor(ev, response) {
    const color = ev.target.value;
    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);
    const opacity = 0.2;
    const bgColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    response.patchValue({ backgroundColor: bgColor });
  }

  keytab(event) {
    const element = event.srcElement.nextElementSibling;

    if (element == null) return;
    else element.focus();
  }

  cancelResponse = () => {
    this.formService.setMultiChoiceOpenState({ isOpen: false, response: {} });
  };

  applySliderOptions(values) {
    this.setSliderValues.emit(values);
    this.formService.setsliderOpenState({
      isOpen: false,
      questionId: '',
      value: 'TF'
    });
  }

  cancelSlider = () => {
    this.formService.setsliderOpenState({
      isOpen: false,
      questionId: '',
      value: 'TF'
    });
  };

  cancelRangeSelection = () => {
    this.formService.setRangeSelectorOpenState({
      isOpen: false,
      questionId: '',
      rangeMetadata: {} as NumberRangeMetadata
    });
  };

  submitRangeSelection = () => {
    if (this.rangeMetadataForm.value?.min > this.rangeMetadataForm.value?.max) {
      this.toast.show({
        text: 'The upper limit cannot be lower than the lower limit',
        type: 'warning'
      });
      return;
    }
    this.rangeSelectionHandler.emit({
      eventType: 'update',
      data: this.rangeMetadataForm.getRawValue()
    });
    this.formService.setRangeSelectorOpenState({
      isOpen: false,
      questionId: '',
      rangeMetadata: {} as NumberRangeMetadata
    });
  };
  focusMinMsg() {
    document.getElementById('minMsgInput').focus();
  }
  focusMaxMsg() {
    document.getElementById('maxMsgInput').focus();
  }

  getImage(action) {
    return `icon-${action.toLowerCase()}`;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
