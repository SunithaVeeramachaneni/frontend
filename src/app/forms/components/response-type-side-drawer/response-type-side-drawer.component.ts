/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { isEqual } from 'lodash-es';
import { Observable, Subject, merge, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  pairwise,
  startWith,
  takeUntil,
  tap
} from 'rxjs/operators';
import {
  NumberRangeMetadata,
  Question,
  RangeSelectorState,
  ResponseTypeOpenState,
  SliderSelectorState,
  AdditionalDetailsState,
  AdditionalDetails,
  ValidationError
} from 'src/app/interfaces';
import { FormService } from '../../services/form.service';
import { ToastService } from 'src/app/shared/toast';
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';

@Component({
  selector: 'app-response-type-side-drawer',
  templateUrl: './response-type-side-drawer.component.html',
  styleUrls: ['./response-type-side-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponseTypeSideDrawerComponent implements OnInit, OnDestroy {
  @ViewChild('tagsInput', { static: false })
  tagsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) auto: MatAutocompleteTrigger;
  @Input() formId;
  @Input() tagDetailType: string;
  @Input() attributeDetailType: string;

  @Output() setSliderValues: EventEmitter<any> = new EventEmitter<any>();

  @Output() responseTypeHandler: EventEmitter<any> = new EventEmitter<any>();
  @Output() rangeSelectionHandler: EventEmitter<any> = new EventEmitter<any>();
  @Output() setAdditionalDetails: EventEmitter<any> = new EventEmitter<any>();

  @Input() set question(question: Question) {
    if (question) {
      this._question = question;
    }
  }
  get question(): Question {
    return this._question;
  }
  sliderOpenState$: Observable<SliderSelectorState>;
  multipleChoiceOpenState$: Observable<ResponseTypeOpenState>;
  rangeSelectorOpenState$: Observable<RangeSelectorState>;
  additionalDetailsOpenState$: Observable<AdditionalDetailsState>;

  responseId = '';
  respType = '';
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  labelSelected: any;
  deletedLabel = '';
  convertedDetail = {};

  public responseForm: FormGroup;
  public rangeMetadataForm: FormGroup;
  public additionalDetailsForm: FormGroup;
  public sliderOptionsForm: FormGroup;

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

  additionalDetailsOpenState: AdditionalDetailsState = {
    isOpen: false,
    questionId: '',
    additionalDetails: {} as AdditionalDetails
  };

  tagsCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  allTags: string[] = [];
  originalTags: string[] = [];
  attributesIdMap = {};
  attributes: FormArray;
  changedValues: any;
  filteredLabels$: Observable<any>;
  filteredValues$: Observable<any>;
  labels: any = {};
  errors: ValidationError = {};

  lowerLimitActions = ['None', 'Warning', 'Alert', 'Note'];
  upperLimitActions = ['None', 'Warning', 'Alert', 'Note'];
  isCreate = true;
  private onDestroy$ = new Subject();
  private _question: Question;

  constructor(
    private formService: FormService,
    private rdfService: RaceDynamicFormService,
    private fb: FormBuilder,
    private cdrf: ChangeDetectorRef,
    private readonly toast: ToastService,
    private operatorRoundService: OperatorRoundsService
  ) {
    this.filteredTags = this.tagsCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this.filter(tag) : this.allTags.slice()
      )
    );
  }

  ngOnInit(): void {
    this.rdfService.getDataSetsByType$(this.tagDetailType).subscribe((tags) => {
      if (tags && tags.length) {
        this.allTags = tags[0].values;
        this.originalTags = JSON.parse(JSON.stringify(tags[0].values));
        this.tagsCtrl.setValue('');
        this.cdrf.detectChanges();
      }
    });

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

    this.additionalDetailsForm = this.fb.group({
      tags: [],
      attributes: this.fb.array([])
    });

    this.patchTags(this.question.additionalDetails?.tags || []);
    this.retrieveDetails();
    // this.updateAttributesArray(
    //   this.question.additionalDetails?.attributes || []
    // );

    this.sliderOptionsForm = this.fb.group({
      value: 0,
      min: 0,
      max: 100,
      increment: 1
    });

    this.sliderOpenState$ = this.formService.sliderOpenState$;
    this.multipleChoiceOpenState$ = this.formService.multiChoiceOpenState$;
    this.rangeSelectorOpenState$ = this.formService.rangeSelectorOpenState$;
    this.additionalDetailsOpenState$ =
      this.formService.additionalDetailsOpenState$;

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

    this.additionalDetailsOpenState$.subscribe((state) => {
      this.additionalDetailsOpenState = state;
      this.cdrf.detectChanges();
      if (state.isOpen) {
        this.additionalDetailsForm.patchValue({
          ...this.additionalDetailsForm.value,
          tags: state.additionalDetails?.tags || []
        });
        this.updateAttributesArray(
          this.question.additionalDetails?.attributes || []
        );
      }
    });

    this.sliderOpenState$.subscribe((state) => {
      this.sliderOpenState = state;
      this.cdrf.detectChanges();
      if (this.question && typeof this.question.value !== 'string') {
        this.sliderOptionsForm.patchValue(this.question.value);
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

    this.sliderOptionsForm.valueChanges
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
          this.cdrf.markForCheck();
        })
      )
      .subscribe();

    this.additionalDetailsForm.valueChanges
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
          this.cdrf.markForCheck();
        })
      )
      .subscribe();
  }

  patchTags(values: any[]): void {
    this.tags = values;
  }

  updateAttributesArray(values) {
    if (Array.isArray(values)) {
      const formGroups = values?.map((value) =>
        this.fb.group({
          label: [value.FIELDLABEL],
          value: [value.DEFAULTVALUE]
        })
      );
      const formArray = this.fb.array(formGroups);
      this.additionalDetailsForm.setControl('attributes', formArray);
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value || '';

    if (value.trim()) {
      this.tags = [...this.tags, value.trim()];
    }

    if (input) {
      input.value = '';
    }

    this.tagsCtrl.setValue(null);
  }

  openAutoComplete() {
    this.auto.openPanel();
  }

  remove(tag: string): void {
    this.allTags.push(tag);
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags = [...this.tags.slice(0, index), ...this.tags.slice(index + 1)];
    }
    this.filteredTags = of(
      this.tagsCtrl.value
        ? this.filter(this.tagsCtrl.value)
        : this.allTags.slice()
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const index = this.allTags.indexOf(event.option.viewValue);

    if (index >= 0) {
      this.allTags.splice(index, 1);
    }

    this.tags = [...this.tags, event.option.viewValue];
    this.tagsInput.nativeElement.value = '';
    this.tagsCtrl.setValue(null);
    this.additionalDetailsForm.patchValue({
      ...this.additionalDetailsForm.value,
      tags: this.tags
    });
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

  applySliderOptions() {
    if (this.sliderOptionsForm.value.min >= this.sliderOptionsForm.value.max) {
      this.toast.show({
        text: 'The upper limit should be greater than lower limit',
        type: 'warning'
      });
      return;
    }
    if (this.sliderOptionsForm.value.increment <= 0) {
      this.toast.show({
        text: 'Increment value should be greater than 0',
        type: 'warning'
      });
      return;
    }
    if (
      this.sliderOptionsForm.value.max - this.sliderOptionsForm.value.min <
      this.sliderOptionsForm.value.increment
    ) {
      this.toast.show({
        text: 'Increment value cannot be greater than range difference',
        type: 'warning'
      });
      return;
    }
    if (
      (this.sliderOptionsForm.value.max - this.sliderOptionsForm.value.min) %
        this.sliderOptionsForm.value.increment !==
      0
    ) {
      this.toast.show({
        text: 'Increment value should divide range difference',
        type: 'warning'
      });
      return;
    }
    if (this.sliderOptionsForm.value.value < this.sliderOptionsForm.value.min)
      this.sliderOptionsForm.value.value = this.sliderOptionsForm.value.min;
    else if (
      this.sliderOptionsForm.value.value > this.sliderOptionsForm.value.max
    )
      this.sliderOptionsForm.value.value = this.sliderOptionsForm.value.max;
    this.setSliderValues.emit(this.sliderOptionsForm.value);
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

  cancelAdditionalDetails = () => {
    this.formService.setAdditionalDetailsOpenState({
      isOpen: false,
      questionId: '',
      additionalDetails: {} as AdditionalDetails
    });
  };

  submitAdditionalDetails = () => {
    const attributesArray = this.additionalDetailsForm.get(
      'attributes'
    ) as FormArray;
    const updatedattributes = attributesArray.value.map((attributesinfo) => ({
      FIELDLABEL: attributesinfo.label,
      DEFAULTVALUE: attributesinfo.value,
      UIFIELDTYPE: 'LF'
    }));
    const newTags = [];
    this.tags.forEach((selectedTag) => {
      if (this.originalTags.indexOf(selectedTag) < 0) {
        newTags.push(selectedTag);
      }
    });
    if (newTags.length) {
      const dataSet = {
        type: this.tagDetailType,
        values: newTags
      };
      this.rdfService.createTags$(dataSet).subscribe((response) => {
        // do nothing
      });
      this.additionalDetailsForm.patchValue({
        tags: this.tags
      });
    }
    this.setAdditionalDetails.emit({
      ...this.additionalDetailsForm.getRawValue(),
      attributes: updatedattributes
    });
    this.formService.setAdditionalDetailsOpenState({
      isOpen: false,
      questionId: '',
      additionalDetails: {} as AdditionalDetails
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

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter((tag) =>
      tag.toLowerCase().includes(filterValue)
    );
  }

  processValidationErrors(controlName: string): boolean {
    const touched = this.additionalDetailsForm.get(controlName).touched;
    const errors = this.additionalDetailsForm.get(controlName).errors;
    this.errors[controlName] = null;
    if (touched && errors) {
      Object.keys(errors).forEach((messageKey) => {
        this.errors[controlName] = {
          name: messageKey,
          length: errors[messageKey]?.requiredLength
        };
      });
    }
    return !touched || this.errors[controlName] === null ? false : true;
  }

  processValidationErrorsAttributes(
    index: number,
    controlName: string
  ): boolean {
    const touched: boolean = (
      this.additionalDetailsForm?.get('attributes') as FormArray
    )
      .at(index)
      .get(controlName)?.touched;
    const errors: ValidationError = (
      this.additionalDetailsForm?.get('attributes') as FormArray
    )
      .at(index)
      .get(controlName)?.errors;
    this.errors[controlName] = null;
    if (touched && errors) {
      Object.keys(errors)?.forEach((messageKey) => {
        this.errors[controlName] = {
          name: messageKey,
          length: errors[messageKey]?.requiredLength
        };
      });
    }
    return !touched || this.errors[controlName] === null ? false : true;
  }

  addAttributes() {
    this.attributes = this.additionalDetailsForm.get('attributes') as FormArray;
    this.attributes.push(
      this.fb.group({
        label: [
          '',
          [
            Validators.maxLength(25),
            WhiteSpaceValidator.trimWhiteSpace,
            WhiteSpaceValidator.whiteSpace
          ]
        ],
        value: [
          '',
          [
            Validators.maxLength(40),
            WhiteSpaceValidator.trimWhiteSpace,
            WhiteSpaceValidator.whiteSpace
          ]
        ]
      })
    );

    if (this.attributes) {
      merge(
        ...this.attributes.controls.map(
          (control: AbstractControl, index: number) =>
            control.valueChanges.pipe(
              map((value) => ({ rowIndex: index, value }))
            )
        )
      ).subscribe((changes) => {
        this.changedValues = changes.value;
        if (this.changedValues.label) {
          this.filteredLabels$ = of(
            Object.keys(this.labels).filter(
              (label) =>
                label
                  .toLowerCase()
                  .indexOf(this.changedValues.label.toLowerCase()) === 0
            )
          );
        } else {
          this.filteredLabels$ = of([]);
        }

        if (this.changedValues.value && this.labels[this.changedValues.label]) {
          this.filteredValues$ = of(
            this.labels[this.changedValues.label]?.filter(
              (value) =>
                value
                  .toLowerCase()
                  .indexOf(this.changedValues.value.toLowerCase()) === 0
            )
          );
        } else {
          this.filteredValues$ = of([]);
        }
      });
    }
  }

  deleteAttributes(index: number) {
    const add = this.additionalDetailsForm.get('attributes') as FormArray;
    add.removeAt(index);
  }

  storeDetails(i) {
    this.operatorRoundService
      .createAdditionalDetails$({
        ...this.changedValues,
        type: this.attributeDetailType,
        level: 'detail'
      })
      .subscribe((response) => {
        if (response?.label) {
          this.toast.show({
            type: 'success',
            text: 'Label added successfully'
          });
        }
        const additionalinfoArray = this.additionalDetailsForm.get(
          'attributes'
        ) as FormArray;
        this.labels[response?.label] = response?.values;
        this.filteredLabels$ = of(Object.keys(this.labels));
        this.attributesIdMap[response?.label] = response?.id;
        additionalinfoArray.at(i).get('label').setValue(response.label);
      });
  }

  storeValueDetails(i) {
    const currentLabel = this.changedValues.label;
    const currentValue = this.changedValues.value;
    if (Object.keys(this.labels).includes(currentLabel)) {
      if (
        this.labels[currentLabel].every(
          (value) => value.toLowerCase() !== currentValue.toLowerCase()
        )
      ) {
        const newValues = [...this.labels[currentLabel], currentValue];
        this.operatorRoundService
          .updateValues$({
            value: newValues,
            labelId: this.attributesIdMap[currentLabel]
          })
          .subscribe(() => {
            this.toast.show({
              type: 'success',
              text: 'Value added successfully'
            });
            this.labels[currentLabel] = newValues;
            this.filteredValues$ = of(this.labels[currentLabel]);
            const additionalinfoArray = this.additionalDetailsForm.get(
              'attributes'
            ) as FormArray;
            additionalinfoArray.at(i).get('value').setValue(currentValue);
          });
      } else {
        this.toast.show({
          type: 'warning',
          text: 'Value already exists'
        });
      }
    } else {
      this.toast.show({
        type: 'warning',
        text: 'Label does not exist'
      });
    }
  }

  retrieveDetails() {
    this.operatorRoundService
      .getAdditionalDetails$({
        type: this.attributeDetailType,
        level: 'detail'
      })
      .subscribe((details: any[]) => {
        this.labels = this.convertArrayToObject(details);
        details.forEach((data) => {
          this.attributesIdMap[data.label] = data.id;
        });
      });
  }

  convertArrayToObject(details) {
    details.map((obj) => {
      this.convertedDetail[obj.label] = obj.values;
    });
    return this.convertedDetail;
  }

  valueOptionClick(index) {
    this.labelSelected =
      this.additionalDetailsForm.get('attributes').value[index].label;
    if (
      this.additionalDetailsForm.get('attributes').value[index].value &&
      this.labelSelected &&
      this.labels[this.labelSelected]
    ) {
      this.filteredValues$ = of(
        this.labels[
          this.additionalDetailsForm.get('attributes').value[index].label
        ].filter((data) =>
          data.includes(
            this.additionalDetailsForm.get('attributes').value[index].value
          )
        )
      );
    } else {
      this.filteredValues$ = of([]);
    }
  }

  labelOptionClick(index) {
    const labelSelectedData =
      this.additionalDetailsForm.get('attributes').value[index].label;
    if (labelSelectedData) {
      this.filteredLabels$ = of(
        Object.keys(this.labels).filter((data) =>
          data.includes(labelSelectedData)
        )
      );
    } else {
      this.filteredLabels$ = of([]);
    }
  }

  removeLabel(label, i) {
    const documentId = this.attributesIdMap[label];
    this.operatorRoundService.removeLabel$(documentId).subscribe(() => {
      delete this.labels[label];
      delete this.attributesIdMap[label];
      this.toast.show({
        type: 'success',
        text: 'Label deleted Successfully'
      });
      this.deletedLabel = label;
      const additionalinfoArray = this.additionalDetailsForm.get(
        'attributes'
      ) as FormArray;
      additionalinfoArray.at(i).get('label').setValue('');
      additionalinfoArray.controls.forEach((control, index) => {
        if (control.value.label === label) {
          control.get('label').setValue('');
          control.get('value').setValue('');
        }
      });
    });
  }
  removeValue(deleteValue, i) {
    const currentLabel = this.changedValues.label;
    const newValue = this.labels[this.changedValues.label].filter(
      (value) => value !== deleteValue
    );
    this.operatorRoundService
      .deleteAdditionalDetailsValue$({
        value: newValue,
        labelId: this.attributesIdMap[this.changedValues.label]
      })
      .subscribe(() => {
        this.labels[this.changedValues.label] = newValue;
        this.toast.show({
          type: 'success',
          text: 'Value deleted Successfully'
        });
        const additionalinfoArray = this.additionalDetailsForm.get(
          'attributes'
        ) as FormArray;
        additionalinfoArray.at(i).get('value').setValue('');
        additionalinfoArray.controls.forEach((control, index) => {
          if (
            control.value.value === deleteValue &&
            control.value.label === currentLabel
          ) {
            control.get('value').setValue('');
          }
        });
      });
  }
  getAttributeList() {
    return (this.additionalDetailsForm.get('attributes') as FormArray).controls;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
