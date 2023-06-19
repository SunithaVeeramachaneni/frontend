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
  labelCtrl = new FormControl();
  valueCtrl = new FormControl();
  filteredLabels: Observable<string[]>;
  filteredValues: Observable<string[]>;
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

  createAdditionalDetails$ = (
    details: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._postData(
      environment.operatorRoundsApiUrl,
      `round-plans/additional-details`,
      `round-plans/additional-details`,
      details,
      info
    );

  getAdditionalDetails$ = (
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any[]> =>
    this.appService._getResp(
      environment.operatorRoundsApiUrl,
      'round-plans/additional-details',
      info
    );

  removeLable$ = (
    label: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._removeData(
      environment.operatorRoundsApiUrl,
      `round-plans/delete-label/${label}`,
      info
    );
  removeValue$ = (
    detail: object,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService.patchData(
      environment.operatorRoundsApiUrl,
      `round-plans/delete-value/`,
      detail,
      info
    );

  next() {
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

  storeDetails() {
    this.rdfService.createAdditionalDetails$(this.changedValues).subscribe(
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
    this.rdfService.getAdditionalDetails$().subscribe(
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
    this.labelSelected =
      this.headerDataForm.get('additionalDetails').value[index].label;
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

  removeLabel(label) {
    this.rdfService.removeLable$(label).subscribe((response) => {
      if (response.acknowledge) {
        this.toastService.show({
          type: 'success',
          text: 'Label deleted Successfully'
        });
      } else {
        this.toastService.show({
          type: 'warning',
          text: 'Value is not Deleted'
        });
      }
    });
  }
  removeValue(value) {
    this.rdfService
      .removeValue$({ value: value, label: this.labelSelected })
      .subscribe((response) => {
        this.toastService.show({
          type: 'success',
          text: 'Value deleted Successfully'
        });
      });
  }
}
