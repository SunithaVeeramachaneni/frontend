/* eslint-disable @typescript-eslint/naming-convention */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Inject
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
import { Store } from '@ngrx/store';
import { State } from 'src/app/forms/state';
import { BuilderConfigurationActions } from 'src/app/forms/state/actions';
import {
  DEFAULT_PDF_BUILDER_CONFIG,
  formConfigurationStatus
} from 'src/app/app.constants';
import { RaceDynamicFormService } from '../services/rdf.service';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { ToastService } from 'src/app/shared/toast';
@Component({
  selector: 'app-form-configuration-modal',
  templateUrl: './form-configuration-modal.component.html',
  styleUrls: ['./form-configuration-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormConfigurationModalComponent implements OnInit {
  @ViewChild('tagsInput', { static: false })
  tagsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) auto: MatAutocompleteTrigger;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  labels: any = {};
  filteredLabels$: Observable<any>;
  filteredValues$: Observable<any>;
  allTags: string[] = [];
  originalTags: string[] = [];
  allPlantsData = [];
  plantInformation = [];
  changedValues: any;
  addNewShow = new BehaviorSubject<boolean>(false);
  headerDataForm: FormGroup;
  errors: ValidationError = {};
  convertedDetail = {};
  additionalDetailsIdMap = {};
  deletedLabel = '';

  plantFilterInput = '';
  readonly formConfigurationStatus = formConfigurationStatus;
  additionalDetails: FormArray;
  labelSelected: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<FormConfigurationModalComponent>,
    private readonly loginService: LoginService,
    private store: Store<State>,
    private rdfService: RaceDynamicFormService,
    private cdrf: ChangeDetectorRef,
    private plantService: PlantService,
    private toastService: ToastService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.rdfService.getDataSetsByType$('tags').subscribe((tags) => {
      if (tags && tags.length) {
        this.allTags = tags[0].values;
        this.originalTags = JSON.parse(JSON.stringify(tags[0].values));
        this.tagsCtrl.setValue('');
        this.cdrf.detectChanges();
      }
    });
    this.filteredTags = this.tagsCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this.filter(tag) : this.allTags.slice()
      )
    );
  }

  ngOnInit(): void {
    this.headerDataForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      description: [''],
      isPublic: [false],
      isArchived: [false],
      formStatus: [formConfigurationStatus.draft],
      formType: [formConfigurationStatus.standalone],
      tags: [this.tags],
      plantId: ['', Validators.required],
      additionalDetails: this.fb.array([])
    });
    this.getAllPlantsData();
    this.retrieveDetails();
  }

  getAllPlantsData() {
    this.plantService.fetchAllPlants$().subscribe((plants) => {
      this.allPlantsData = plants.items || [];
      this.plantInformation = this.allPlantsData;
    });

    if (this.data) {
      this.headerDataForm.patchValue({
        name: this.data.name,
        description: this.data.description
      });
      this.headerDataForm.markAsDirty();
    }
  }

  resetPlantSearchFilter = () => {
    this.plantFilterInput = '';
    this.plantInformation = this.allPlantsData;
  };

  onKeyPlant(event) {
    this.plantFilterInput = event.target.value.trim() || '';

    if (this.plantFilterInput) {
      this.plantInformation = this.allPlantsData.filter(
        (plant) =>
          plant.name.toLowerCase().indexOf(this.plantFilterInput) !== -1 ||
          plant.plantId.toLowerCase().indexOf(this.plantFilterInput) !== -1
      );
    } else {
      this.plantInformation = this.allPlantsData;
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.tags.push(value.trim());
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
      this.tags.splice(index, 1);
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

    this.tags.push(event.option.viewValue);
    this.tagsInput.nativeElement.value = '';
    this.tagsCtrl.setValue(null);
  }

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter((tag) =>
      tag.toLowerCase().includes(filterValue)
    );
  }

  next() {
    const additionalinfoArray = this.headerDataForm.get(
      'additionalDetails'
    ) as FormArray;
    const updatedAdditionalDetails = additionalinfoArray.value.map(
      (additionalinfo) => ({
        FIELDLABEL: additionalinfo.label,
        DEFAULTVALUE: additionalinfo.value,
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
        type: 'tags',
        values: newTags
      };
      this.rdfService.createTags$(dataSet).subscribe((response) => {
        // do nothing
      });
    }

    const plant = this.allPlantsData.find(
      (p) => p.id === this.headerDataForm.get('plantId').value
    );

    if (this.headerDataForm.valid) {
      const userName = this.loginService.getLoggedInUserName();
      this.store.dispatch(
        BuilderConfigurationActions.addFormMetadata({
          formMetadata: {
            ...this.headerDataForm.value,
            additionalDetails: updatedAdditionalDetails,
            plant: plant.name
          },
          formDetailPublishStatus: formConfigurationStatus.draft,
          formSaveStatus: formConfigurationStatus.saving
        })
      );
      this.store.dispatch(
        BuilderConfigurationActions.updateCreateOrEditForm({
          createOrEditForm: true
        })
      );
      this.store.dispatch(
        BuilderConfigurationActions.createForm({
          formMetadata: {
            ...this.headerDataForm.value,
            additionalDetails: updatedAdditionalDetails,
            pdfTemplateConfiguration: DEFAULT_PDF_BUILDER_CONFIG,
            author: userName,
            formLogo: 'assets/rdf-forms-icons/formlogo.svg'
          }
        })
      );

      if (this.data) {
        this.rdfService
          .updateTemplate$(this.data.id, {
            formsUsageCount: this.data.formsUsageCount + 1
          })
          .subscribe(() => {
            this.router
              .navigate(['/forms/create'], {
                state: { selectedTemplate: this.data }
              })
              .then(() => this.dialogRef.close());
          });
      } else {
        this.router
          .navigate(['/forms/create'])
          .then(() => this.dialogRef.close());
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

  addAdditionalDetails() {
    this.additionalDetails = this.headerDataForm.get(
      'additionalDetails'
    ) as FormArray;
    this.additionalDetails.push(
      this.fb.group({
        label: ['', [Validators.maxLength(25)]],
        value: ['', [Validators.maxLength(40)]]
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
            Object.keys(this.labels).filter((label) => {
              if (this.deletedLabel !== label) {
                return label.includes(this.changedValues.label);
              }
            })
          );
        } else {
          this.filteredLabels$ = of([]);
        }

        if (this.changedValues.value && this.labels[this.changedValues.label]) {
          this.filteredValues$ = of(
            this.labels[this.changedValues.label].filter((values) =>
              values.includes(this.changedValues.value)
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
    this.rdfService
      .createAdditionalDetails$({ ...this.changedValues, updateType: 'add' })
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
    if (Object.keys(this.labels).includes(this.changedValues.label)) {
      this.rdfService
        .updateValues$({
          label: this.changedValues.label,
          value: this.changedValues.value,
          updateType: 'add',
          labelId: this.additionalDetailsIdMap[this.changedValues.label]
        })
        .subscribe((response) => {
          if (response?.label) {
            this.toastService.show({
              type: 'success',
              text: 'Value added successfully'
            });
          }
          this.labels[response.label] = response.values;
          this.filteredLabels$ = of(Object.keys(this.labels));

          const additionalinfoArray = this.headerDataForm.get(
            'additionalDetails'
          ) as FormArray;

          additionalinfoArray
            .at(i)
            .get('value')
            .setValue(response.values.slice(-1));
        });
    } else {
      this.toastService.show({
        type: 'warning',
        text: 'The selected label does not exist'
      });
    }
  }

  retrieveDetails() {
    this.rdfService.getAdditionalDetails$().subscribe(
      (details: any[]) => {
        this.labels = this.convertArrayToObject(details);
        details.forEach((data) => {
          this.additionalDetailsIdMap[data.label] = data.id;
        });
      },
      (error) => {
        this.toastService.show({ type: 'warning', text: error });
      }
    );
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

  removeLabel(label) {
    const documentId = this.additionalDetailsIdMap[label];
    this.rdfService.removeLabel$(documentId).subscribe((response) => {
      delete this.labels[label];
      delete this.additionalDetailsIdMap[label];
      if (response.acknowledged) {
        this.toastService.show({
          type: 'success',
          text: 'Label deleted Successfully'
        });
        this.deletedLabel = label;
      } else {
        this.toastService.show({
          type: 'warning',
          text: 'Label is not Deleted'
        });
      }
    });
  }
  removeValue(deleteValue) {
    this.rdfService
      .deleteAdditionalDetailsValue$({
        label: this.changedValues.label,
        value: deleteValue,
        labelId: this.additionalDetailsIdMap[this.changedValues.label],
        updateType: 'delete'
      })
      .subscribe((response) => {
        this.labels[response.label] = response.values;
        if (!response.values.includes(deleteValue)) {
          this.toastService.show({
            type: 'success',
            text: 'Value deleted Successfully'
          });
        } else {
          this.toastService.show({
            type: 'warning',
            text: 'Value is not deleted'
          });
        }
      });
  }
  getAdditionalDetailList() {
    return (this.headerDataForm.get('additionalDetails') as FormArray).controls;
  }
}
