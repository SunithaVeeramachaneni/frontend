/* eslint-disable @typescript-eslint/naming-convention */
import {
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
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { BehaviorSubject, Observable, of, merge } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ErrorInfo, ValidationError } from 'src/app/interfaces';
import { Router } from '@angular/router';
import { LoginService } from '../../login/services/login.service';
import {
  DEFAULT_TEMPLATE_PAGES,
  formConfigurationStatus
} from 'src/app/app.constants';
import { RaceDynamicFormService } from '../services/rdf.service';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { DuplicateNameValidator } from 'src/app/shared/validators/duplicate-name-validator';
import { environment } from 'src/environments/environment';
import { AppService } from 'src/app/shared/services/app.services';
import { ToastService } from 'src/app/shared/toast';
@Component({
  selector: 'app-template-configuration-modal',
  templateUrl: './template-configuration-modal.component.html',
  styleUrls: ['./template-configuration-modal.component.scss']
})
export class TemplateConfigurationModalComponent implements OnInit {
  @ViewChild('tagsInput', { static: false })
  tagsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  labels: any = {};
  filteredLabels$: Observable<string[]>;
  filteredValues$: Observable<string[]>;
  allTags: string[] = [];
  originalTags: string[] = [];
  changedValues: any;
  addNewShow = new BehaviorSubject<boolean>(false);
  headerDataForm: FormGroup;
  errors: ValidationError = {};
  convertedDetail = {};
  readonly formConfigurationStatus = formConfigurationStatus;
  additionalDetails: FormArray;
  labelSelected: any;
  additionalDetailsIdMap = {};
  deletedLabel = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<TemplateConfigurationModalComponent>,
    private readonly loginService: LoginService,
    private rdfService: RaceDynamicFormService,
    private cdrf: ChangeDetectorRef,
    private appService: AppService,
    private toastService: ToastService,
    @Inject(MAT_DIALOG_DATA)
    private data: any
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
          WhiteSpaceValidator.trimWhiteSpace,
          DuplicateNameValidator.duplicateNameValidator(
            this.data.map((item) => item.name)
          )
        ]
      ],
      description: [''],
      isPublic: [false],
      isArchived: [false],
      formStatus: [formConfigurationStatus.draft],
      formType: [formConfigurationStatus.standalone],
      tags: [this.tags],
      additionalDetails: this.fb.array([])
    });
    this.retrieveDetails();
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

  remove(tag: string): void {
    this.allTags.push(tag);
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
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
      this.rdfService.createTags$(dataSet).subscribe();
    }

    if (this.headerDataForm.valid) {
      const userEmail = this.loginService.getLoggedInEmail();
      this.rdfService
        .createTemplate$({
          ...this.headerDataForm.value,
          additionalDetails: updatedAdditionalDetails,
          author: userEmail,
          formLogo: 'assets/rdf-forms-icons/formlogo.svg'
        })
        .subscribe((template) => {
          this.rdfService
            .createAuthoredTemplateDetail$(template.id, {
              formStatus: formConfigurationStatus.draft,
              pages: DEFAULT_TEMPLATE_PAGES,
              counter: 4
            })
            .subscribe(() => {
              this.router
                .navigate(['/forms/templates/edit', template.id], {
                  state: { allTemplates: this.data }
                })
                .then(() => this.dialogRef.close());
            });
        });
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

  storeDetails(i) {
    this.rdfService
      .createAdditionalDetails$({ ...this.changedValues, updateType: 'add' })
      .subscribe((response) => {
        const additionalinfoArray = this.headerDataForm.get(
          'additionalDetails'
        ) as FormArray;
        this.labels[response.label] = response.value;
        this.filteredLabels$ = of(Object.keys(this.labels));
        additionalinfoArray.at(i).get('label').setValue(response.label);
      });
    this.retrieveDetails();
  }

  storeValueDetails(i) {
    this.rdfService
      .createAdditionalDetails$(this.changedValues)
      .subscribe((response) => {
        const additionalinfoArray = this.headerDataForm.get(
          'additionalDetails'
        ) as FormArray;

        additionalinfoArray
          .at(i)
          .get('value')
          .setValue(response.values.slice(-1));
        additionalinfoArray.at(i).get('id').setValue(response.id);
      });
  }

  retrieveDetails() {
    this.rdfService.getAdditionalDetails$().subscribe(
      (details: any[]) => {
        console.log('resposne :', details);
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
    this.labels[this.changedValues.label]
      ? this.addNewShow.next(true)
      : this.addNewShow.next(false);
  }
  removeLabel(label) {
    const documentId = this.additionalDetailsIdMap[label];
    this.rdfService.removeLabel$(documentId).subscribe((response) => {
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
        label: this.labelSelected,
        value: deleteValue,
        labelId: this.additionalDetailsIdMap[this.labelSelected],
        updateType: 'delete'
      })
      .subscribe((response) => {
        if (response.acknowledge) {
          this.toastService.show({
            type: 'success',
            text: 'Value deleted Successfully'
          });
        } else {
          this.toastService.show({
            type: 'warning',
            text: 'Label is not Deleted'
          });
        }
      });
  }
  getAdditionalDetailList() {
    return (this.headerDataForm.get('additionalDetails') as FormArray).controls;
  }
}
