/* eslint-disable @typescript-eslint/naming-convention */
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialogRef } from '@angular/material/dialog';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import {
  BehaviorSubject,
  Observable,
  of,
  Subscription,
  Subject,
  merge
} from 'rxjs';
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
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ValidationError } from 'src/app/interfaces';
import { Router } from '@angular/router';
import { LoginService } from '../../login/services/login.service';
import {
  DEFAULT_TEMPLATE_PAGES_STANDALONE,
  DEFAULT_TEMPLATE_PAGES_EMBEDDED,
  formConfigurationStatus,
  raceDynamicForms
} from 'src/app/app.constants';
import { RaceDynamicFormService } from '../services/rdf.service';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { BuilderConfigurationActions } from 'src/app/forms/state/actions';
import { Store } from '@ngrx/store';
import { State, getFormMetadata } from 'src/app/forms/state';
import { TemplateModalComponent } from '../template-modal/template-modal.component';
import { isEqual } from 'lodash-es';
import { FormUpdateProgressService } from 'src/app/forms/services/form-update-progress.service';
import { ToastService } from 'src/app/shared/toast';
import { OperatorRoundsService } from '../../operator-rounds/services/operator-rounds.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { ResponseSetService } from '../../master-configurations/response-set/services/response-set.service';
@Component({
  selector: 'app-template-header-configuration',
  templateUrl: './template-header-configuration.component.html',
  styleUrls: ['./template-header-configuration.component.scss']
})
export class TemplateHeaderConfigurationComponent implements OnInit, OnDestroy {
  @ViewChild('tagsInput', { static: false })
  tagsInput: ElementRef<HTMLInputElement>;

  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @Input() alltemplatesData;
  @Input() templateData;
  @Output() gotoNextStep = new EventEmitter<void>();
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl: FormControl;
  filteredTags: Observable<string[]>;
  tags: string[] = [];

  labels: any = {};
  filteredLabels$: Observable<string[]>;
  filteredValues$: Observable<string[]>;
  changedValues: any;
  addNewShow = new BehaviorSubject<boolean>(false);
  headerDataForm: FormGroup;
  errors: ValidationError = {};
  convertedDetail = {};
  readonly formConfigurationStatus = formConfigurationStatus;
  additionalDetails: FormArray;
  labelSelected: any;
  deletedLabel = '';
  additionalDetailsIdMap = {};
  allTags: string[] = [];
  originalTags: string[] = [];
  formMetadataSubscription: Subscription;
  hasFormChanges = false;
  additionalDetailMap = {};
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  ghostLoading = new Array(3).fill(0).map((v, i) => i);
  additionalDetailsMasterData = {};
  currentValuesArray = [];
  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<TemplateModalComponent>,
    private readonly loginService: LoginService,
    private rdfService: RaceDynamicFormService,
    private store: Store<State>,
    private cdrf: ChangeDetectorRef,
    private formProgressService: FormUpdateProgressService,
    private toastService: ToastService,
    private operatorRoundService: OperatorRoundsService,
    private responseSetSerivce: ResponseSetService
  ) {}

  ngOnInit(): void {
    this.tagsCtrl = new FormControl('', [
      Validators.maxLength(25),
      WhiteSpaceValidator.whiteSpace,
      WhiteSpaceValidator.trimWhiteSpace
    ]);
    this.rdfService
      .getDataSetsByType$('formTemplateHeaderTags')
      .subscribe((tags) => {
        if (tags && tags.length) {
          this.allTags = tags[0].values;
          this.originalTags = JSON.parse(JSON.stringify(tags[0].values));
          this.tagsCtrl.patchValue('');
          this.cdrf.detectChanges();
        }
      });
    this.filteredTags = this.tagsCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this.filter(tag) : this.allTags.slice()
      )
    );
    this.headerDataForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ],
        this.validateTemplateName.bind(this)
      ],
      description: [''],
      isPublic: [false],
      isArchived: [false],
      formStatus: [formConfigurationStatus.draft],
      formType: [this.alltemplatesData?.formType],
      tags: [this.tags],
      additionalDetails: this.fb.array([])
    });
    this.retrieveDetails();
    this.additionalDetails = this.headerDataForm.get(
      'additionalDetails'
    ) as FormArray;
    this.responseSetSerivce
      .fetchResponseSetByModuleName$()
      .subscribe((response) => {
        if (Object.keys(response).length) {
          let responseSets = response.RDF_TEMPLATES;
          responseSets.forEach((responseSet) => {
            let values = [];

            JSON.parse(responseSet.values).forEach((val) => {
              values.push(val.title);
            });
            let selectedValues = [];
            if (Object.keys(this.templateData.formMetadata).length) {
              const obj = this.templateData.formMetadata.additionalDetails.find(
                (object) => object.FIELDLABEL === responseSet.name
              );
              selectedValues = obj ? obj.DEFAULTVALUE.split(',') : [];
            }
            this.additionalDetailMap[responseSet.name] = selectedValues;
            const objFormGroup = this.fb.group({
              label: [responseSet.name],
              value: [values],
              selectedValue: [selectedValues]
            });
            this.additionalDetails.push(objFormGroup);
            this.additionalDetailsMasterData[responseSet.name] = {
              value: values,
              selectedValue: selectedValues
            };
          });
          this.headerDataForm.setControl(
            'additionalDetails',
            this.additionalDetails
          );
          this.isLoading$.next(false);
        }
      });

    this.formMetadataSubscription = this.store
      .select(getFormMetadata)
      .subscribe((res) => {
        this.headerDataForm.patchValue({
          name: res.name,
          description: res.description ? res.description : ''
        });
      });

    this.patchTemplateDetails();

    this.headerDataForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(100),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([previous, current]) => {
          if (isEqual(previous, current)) this.hasFormChanges = false;
          else this.hasFormChanges = true;
        })
      )
      .subscribe();
    this.store.dispatch(
      BuilderConfigurationActions.updateModuleName({
        moduleName: raceDynamicForms
      })
    );
  }

  add(event: MatChipInputEvent): void {
    if (!this.processValidationErrorTags()) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        this.tags = [...this.tags, value.trim()];
      }

      if (input) {
        input.value = '';
      }

      this.tagsCtrl.patchValue('');
    }
  }

  processValidationErrorTags(): boolean {
    const errors = this.tagsCtrl.errors;

    this.errors.tagsCtrl = null;
    if (errors) {
      Object.keys(errors).forEach((messageKey) => {
        this.errors.tagsCtrl = {
          name: messageKey,
          length: errors[messageKey]?.requiredLength
        };
      });
    }
    return this.errors.tagsCtrl === null ? false : true;
  }

  remove(tag: string): void {
    this.allTags.push(tag);
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags = [...this.tags.slice(0, index), ...this.tags.slice(index + 1)];
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const index = this.allTags.indexOf(event.option.viewValue);

    if (index >= 0) {
      this.allTags.splice(index, 1);
    }

    this.tags = [...this.tags, event.option.viewValue];
    this.tagsInput.nativeElement.value = '';
    this.tagsCtrl.patchValue('');
    this.headerDataForm.patchValue({
      ...this.headerDataForm.value,
      tags: this.tags
    });
  }

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter((tag) =>
      tag.toLowerCase().includes(filterValue)
    );
  }

  validateTemplateName(control: AbstractControl) {
    return this.checkTemplateNameExists(control.value).pipe(
      map((res) => (res ? null : { exists: true }))
    );
  }

  checkTemplateNameExists(name: string): Observable<boolean> {
    if (name !== this.templateData?.formMetadata?.name) {
      return this.rdfService
        .fetchTemplates$({ isArchived: false, isDeleted: false })
        .pipe(
          map((templateList: any) =>
            templateList.rows.filter((template) => template.name === name)
          ),
          map((templates: any[]) => !templates.length)
        );
    } else {
      return of(true);
    }
  }

  patchTemplateDetails() {
    if (Object.keys(this.templateData?.formMetadata).length !== 0) {
      this.headerDataForm.patchValue(
        {
          name: this.templateData.formMetadata.name,
          description: this.templateData.formMetadata.description,
          formType: this.templateData.formMetadata.formType,
          formStatus: this.templateData.formMetadata.formStatus
        },
        { emitEvent: false }
      );
      const additionalDetailsArray =
        this.templateData.formMetadata.additionalDetails;

      const tagsValue = this.templateData.formMetadata.tags;

      this.updateAdditionalDetailsArray(additionalDetailsArray);
      this.patchTags(tagsValue);
      this.headerDataForm.markAsDirty();
    }
  }
  patchTags(values: any[]): void {
    this.tags = values;
  }

  updateAdditionalDetailsArray(values) {
    if (Array.isArray(values)) {
      const formGroups = values?.map((value) =>
        this.fb.group({
          label: [value.FIELDLABEL],
          value: [value.DEFAULTVALUE]
        })
      );
      const formArray = this.fb.array(formGroups);
      this.headerDataForm.setControl('additionalDetails', formArray);
    }
  }
  next() {
    const additionalinfoArray = this.headerDataForm.get(
      'additionalDetails'
    ) as FormArray;
    const updatedAdditionalDetails = additionalinfoArray.value.map(
      (additionalinfo) => ({
        FIELDLABEL: additionalinfo.label,
        DEFAULTVALUE: this.additionalDetailMap[additionalinfo.label].reduce(
          (accumulatedLable, current) => {
            return accumulatedLable === ''
              ? current
              : accumulatedLable + ',' + current;
          },
          ''
        ),
        UIFIELDTYPE: 'LF'
      })
    );
    const newTags = [];
    this.tags.forEach((selectedTag) => {
      if (this.originalTags.indexOf(selectedTag) < 0) {
        newTags.push(selectedTag);
      }
    });
    if (newTags.length) {
      const dataSet = {
        type: 'formTemplateHeaderTags',
        values: newTags
      };
      this.rdfService.createTags$(dataSet).subscribe((response) => {
        // do nothing
      });
    }

    if (this.headerDataForm.valid) {
      const userEmail = this.loginService.getLoggedInEmail();
      if (this.templateData.templateExists === false) {
        this.rdfService
          .createTemplate$({
            ...this.headerDataForm.value,
            tags: this.tags,
            additionalDetails: updatedAdditionalDetails,
            author: userEmail,
            formLogo: 'assets/rdf-forms-icons/formlogo.svg'
          })
          .subscribe((template) => {
            this.rdfService
              .createAuthoredTemplateDetail$(template.id, {
                formStatus: formConfigurationStatus.draft,
                pages: this.getDefaultTemplateQuestions(
                  this.headerDataForm?.value?.formType
                ),
                counter: 4
              })
              .subscribe(() => {
                this.formProgressService.isTemplateCreated$.next(true);
                this.router
                  .navigate(['/forms/templates/edit', template.id], {
                    state: { allTemplates: this.alltemplatesData.data }
                  })
                  .then(() => this.gotoNextStep.emit());
              });
          });
      } else if (this.templateData.templateExists === true) {
        this.formProgressService.isTemplateCreated$.next(false);
        this.store.dispatch(
          BuilderConfigurationActions.updateFormMetadata({
            formMetadata: {
              ...this.headerDataForm.value,
              id: this.templateData.formMetadata.id,
              tags: this.tags,
              additionalDetails: updatedAdditionalDetails
            },
            formStatus: this.hasFormChanges
              ? formConfigurationStatus.draft
              : this.headerDataForm.value.formStatus,
            formDetailPublishStatus: this.hasFormChanges
              ? formConfigurationStatus.draft
              : this.headerDataForm.value.formStatus,
            formSaveStatus: formConfigurationStatus.saving
          })
        );
        this.store.dispatch(
          BuilderConfigurationActions.updateCreateOrEditForm({
            createOrEditForm: true
          })
        );
        this.store.dispatch(
          BuilderConfigurationActions.updateTemplate({
            formMetadata: {
              ...this.headerDataForm.value,
              id: this.templateData.formMetadata.id,
              tags: this.tags,
              additionalDetails: updatedAdditionalDetails
            }
          })
        );
        this.gotoNextStep.emit();
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  processValidationErrors(controlName: string): boolean {
    const touched = this.headerDataForm.get(controlName).touched;
    const errors = this.headerDataForm.get(controlName).errors;
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

  processValidationErrorsAdditionalDetails(
    index: number,
    controlName: string
  ): boolean {
    const touched: boolean = (
      this.headerDataForm?.get('additionalDetails') as FormArray
    )
      .at(index)
      .get(controlName)?.touched;
    const errors: ValidationError = (
      this.headerDataForm?.get('additionalDetails') as FormArray
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

  addAdditionalDetails() {
    this.additionalDetails = this.headerDataForm.get(
      'additionalDetails'
    ) as FormArray;
    this.additionalDetails.push(
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

    if (this.additionalDetails) {
      merge(
        ...this.additionalDetails.controls.map(
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
            this.labels[this.changedValues.label].filter(
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

  deleteAdditionalDetails(index: number) {
    const add = this.headerDataForm.get('additionalDetails') as FormArray;
    add.removeAt(index);
  }

  storeDetails(i) {
    this.operatorRoundService
      .createAdditionalDetails$({
        ...this.changedValues,
        type: 'formTemplates',
        level: 'header'
      })
      .subscribe((response) => {
        if (response?.label) {
          this.toastService.show({
            type: 'success',
            text: 'Label added successfully'
          });
        }
        const additionalinfoArray = this.headerDataForm.get(
          'additionalDetails'
        ) as FormArray;
        this.labels[response?.label] = response?.values;
        this.filteredLabels$ = of(Object.keys(this.labels));
        this.additionalDetailsIdMap[response?.label] = response?.id;
        additionalinfoArray.at(i).get('label').setValue(response.label);
      });
  }

  storeValueDetails(i) {
    const currentLabel = this.changedValues?.label;
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
            labelId: this.additionalDetailsIdMap[currentLabel]
          })
          .subscribe(() => {
            this.toastService.show({
              type: 'success',
              text: 'Value added successfully'
            });
            this.labels[currentLabel] = newValues;
            this.filteredValues$ = of(this.labels[currentLabel]);
            const additionalinfoArray = this.headerDataForm.get(
              'additionalDetails'
            ) as FormArray;
            additionalinfoArray.at(i).get('value').setValue(currentValue);
          });
      } else {
        this.toastService.show({
          type: 'warning',
          text: 'Value already exists'
        });
      }
    } else {
      this.toastService.show({
        type: 'warning',
        text: 'Label does not exist'
      });
    }
  }

  retrieveDetails() {
    this.operatorRoundService
      .getAdditionalDetails$({ type: 'formTemplates', level: 'header' })
      .subscribe((details: any[]) => {
        this.labels = this.convertArrayToObject(details);
        details.forEach((data) => {
          this.additionalDetailsIdMap[data.label] = data.id;
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
      this.headerDataForm.get('additionalDetails').value[index].label;
    if (
      this.headerDataForm.get('additionalDetails').value[index].value &&
      this.labelSelected &&
      this.labels[this.labelSelected]
    ) {
      this.filteredValues$ = of(
        this.labels[
          this.headerDataForm.get('additionalDetails').value[index].label
        ].filter((data) =>
          data.includes(
            this.headerDataForm.get('additionalDetails').value[index].value
          )
        )
      );
    } else {
      this.filteredValues$ = of([]);
    }
  }
  labelOptionClick(index) {
    const labelSelectedData =
      this.headerDataForm.get('additionalDetails').value[index].label;
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
    const documentId = this.additionalDetailsIdMap[label];
    this.operatorRoundService.removeLabel$(documentId).subscribe(() => {
      delete this.labels[label];
      delete this.additionalDetailsIdMap[label];
      this.toastService.show({
        type: 'success',
        text: 'Label deleted Successfully'
      });
      this.deletedLabel = label;
      const additionalinfoArray = this.headerDataForm.get(
        'additionalDetails'
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
        labelId: this.additionalDetailsIdMap[this.changedValues.label]
      })
      .subscribe(() => {
        this.labels[this.changedValues.label] = newValue;
        this.toastService.show({
          type: 'success',
          text: 'Value deleted Successfully'
        });
        const additionalinfoArray = this.headerDataForm.get(
          'additionalDetails'
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
  getAdditionalDetailList() {
    return (this.headerDataForm.get('additionalDetails') as FormArray).controls;
  }

  getDefaultTemplateQuestions(formType) {
    const timestamp = new Date().getTime();
    if (formType === formConfigurationStatus.embedded) {
      DEFAULT_TEMPLATE_PAGES_EMBEDDED.map((page) => {
        page.questions.map(
          (question) => (question.id = `${question.id}_${timestamp}`)
        );
      });
      return DEFAULT_TEMPLATE_PAGES_EMBEDDED;
    } else {
      DEFAULT_TEMPLATE_PAGES_STANDALONE.map((page) => {
        page.questions.map(
          (question) => (question.id = `${question.id}_${timestamp}`)
        );
      });
      return DEFAULT_TEMPLATE_PAGES_STANDALONE;
    }
  }

  ngOnDestroy(): void {
    this.formMetadataSubscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
  onSelectionChange(event, label, index) {
    let selectedArray = [...this.additionalDetailMap[label]];
    const eventValue = event.value;
    const valuesArray =
      this.getAdditionalDetailList()[index].get('value').value;
    valuesArray.forEach((val) => {
      if (eventValue.includes(val)) {
        selectedArray.push(val);
      } else {
        selectedArray = selectedArray.filter((value) => value !== val);
      }
    });
    selectedArray = selectedArray.filter(
      (value, arrIndex, self) => value && self.indexOf(value) === arrIndex
    );
    this.additionalDetailMap[label] = selectedArray;
    this.additionalDetailsMasterData[label].selectedValue = selectedArray;
    this.getAdditionalDetailList()
      [index].get('selectedValue')
      .setValue(selectedArray);
  }
  compareValues(value1: any, value2: any) {
    return value1 && value2 && value1.toLowerCase() === value2.toLowerCase();
  }
  closeSelect(matSelect) {
    matSelect.close();
  }
  valueSearch(event, label, index) {
    const searchValue = event.target.value;
    const parentValues = this.additionalDetailsMasterData[label].value;
    if (searchValue) {
      this.currentValuesArray = parentValues.filter(
        (value) => value.toLowerCase().indexOf(searchValue.toLowerCase()) === 0
      );
    } else {
      this.currentValuesArray = [...parentValues];
    }
    this.getAdditionalDetailList()
      [index].get('value')
      .setValue(this.currentValuesArray);
  }
  matSelectClosed(index, label, searchInput: HTMLInputElement) {
    const parentValueData = this.additionalDetailsMasterData[label].value;
    searchInput.value = '';
    this.getAdditionalDetailList()
      [index].get('value')
      .setValue(parentValueData);
  }
}
