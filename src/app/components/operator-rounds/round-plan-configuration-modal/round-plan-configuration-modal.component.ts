/* eslint-disable @typescript-eslint/naming-convention */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialogRef } from '@angular/material/dialog';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, merge, of, Subscription, BehaviorSubject } from 'rxjs';
import { map, startWith, take, tap } from 'rxjs/operators';
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
import {
  BuilderConfigurationActions,
  RoundPlanConfigurationActions
} from 'src/app/forms/state/actions';
import {
  DEFAULT_PDF_BUILDER_CONFIG,
  formConfigurationStatus
} from 'src/app/app.constants';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { ToastService } from 'src/app/shared/toast';

@Component({
  selector: 'app-round-plan-configuration-modal',
  templateUrl: './round-plan-configuration-modal.component.html',
  styleUrls: ['./round-plan-configuration-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundPlanConfigurationModalComponent implements OnInit {
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
  labelCtrl = new FormControl();
  valueCtrl = new FormControl();
  filteredLabels: Observable<string[]>;
  filteredValues: Observable<string[]>;
  allTags: string[] = [];
  originalTags: string[] = [];
  options: string[] = ['Option 1', 'Option 2', 'Option 3'];
  selectedOption: string;
  allPlantsData = [];
  plantInformation = [];
  changedValues: any;
  addNewShow = new BehaviorSubject<boolean>(false);
  headerDataForm: FormGroup;
  errors: ValidationError = {};
  convertedDetail = {};

  plantFilterInput = '';
  readonly formConfigurationStatus = formConfigurationStatus;
  additionalDetails: FormArray;
  labelSelected: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<RoundPlanConfigurationModalComponent>,
    private readonly loginService: LoginService,
    private store: Store<State>,
    private operatorRoundsService: OperatorRoundsService,
    private plantService: PlantService,
    private cdrf: ChangeDetectorRef,
    private toastService: ToastService
  ) {
    this.operatorRoundsService.getDataSetsByType$('tags').subscribe((tags) => {
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

  getAllPlantsData() {
    this.plantService.fetchAllPlants$().subscribe((plants) => {
      this.allPlantsData = plants.items || [];
      this.plantInformation = this.allPlantsData;
    });
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
    if (!this.changedValues) {
      this.filteredLabels = of(this.labels);
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

    this.headerDataForm.setControl(
      'additionalDetails',
      this.fb.array(updatedAdditionalDetails)
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
      // this.operatorRoundsService.createTags$(dataSet).subscribe((response) => {
      //   // do nothing
      // });
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
            plant: plant.name,
            moduleName: 'rdf'
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
        RoundPlanConfigurationActions.createRoundPlan({
          formMetadata: {
            ...this.headerDataForm.value,
            pdfTemplateConfiguration: DEFAULT_PDF_BUILDER_CONFIG,
            author: userName,
            formLogo: 'assets/img/svg/round-plans-icon.svg'
          }
        })
      );
      this.router.navigate(['/operator-rounds/create']);
      this.dialogRef.close();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
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
          this.filteredLabels = of(
            Object.keys(this.labels).filter((label) => {
              return label.includes(this.changedValues.label);
            })
          );
        } else {
          this.filteredLabels = of([]);
        }
        if (this.changedValues.value && this.labels[this.changedValues.label]) {
          this.filteredValues = of(
            this.labels[this.changedValues.label].filter((values) => {
              return values.includes(this.changedValues.value);
            })
          );
        } else {
          this.filteredValues = of([]);
        }

        this.labels[this.changedValues.label]
          ? this.addNewShow.next(true)
          : this.addNewShow.next(false);
      });
    }
  }

  deleteAdditionalDetails(index: number) {
    const add = this.headerDataForm.get('additionalDetails') as FormArray;
    add.removeAt(index);
  }

  storeDetails() {
    this.operatorRoundsService
      .createAdditionalDetails$(this.changedValues)
      .subscribe(
        (response) => {
          this.toastService.show({
            type: 'success',
            text: 'Additional details stored successfully'
          });
        },
        (error) => {
          this.toastService.show({ type: 'warning', text: error });
        }
      );
    this.retrieveDetails();
  }

  retrieveDetails() {
    this.operatorRoundsService.getAdditionalDetails$().subscribe(
      (details: any[]) => {
        this.labels = this.convertArrayToObject(details);
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
    if (
      this.headerDataForm.get('additionalDetails').value[index].value &&
      this.headerDataForm.get('additionalDetails').value[index].label &&
      this.labels[
        this.headerDataForm.get('additionalDetails').value[index].label
      ]
    ) {
      this.filteredValues = of(
        this.labels[
          this.headerDataForm.get('additionalDetails').value[index].label
        ].filter((data) =>
          data.includes(
            this.headerDataForm.get('additionalDetails').value[index].value
          )
        )
      );
    } else {
      this.filteredValues = of([]);
    }
    this.labels[this.changedValues.label]
      ? this.addNewShow.next(true)
      : this.addNewShow.next(false);
  }
}
