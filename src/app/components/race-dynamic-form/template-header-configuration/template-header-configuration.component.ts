/* eslint-disable @typescript-eslint/naming-convention */
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialogRef } from '@angular/material/dialog';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  BehaviorSubject,
  Observable,
  of,
  merge,
  Subscription,
  Subject
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
  formConfigurationStatus
} from 'src/app/app.constants';
import { RaceDynamicFormService } from '../services/rdf.service';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { AppService } from 'src/app/shared/services/app.services';
import { ToastService } from 'src/app/shared/toast';
import { OperatorRoundsService } from '../../operator-rounds/services/operator-rounds.service';
import { BuilderConfigurationActions } from 'src/app/forms/state/actions';
import { Store } from '@ngrx/store';
import { State, getFormMetadata } from 'src/app/forms/state';
import { TemplateModalComponent } from '../template-modal/template-modal.component';
import { isEqual } from 'lodash-es';
import { FormUpdateProgressService } from 'src/app/forms/services/form-update-progress.service';
@Component({
  selector: 'app-template-header-configuration',
  templateUrl: './template-header-configuration.component.html',
  styleUrls: ['./template-header-configuration.component.scss']
})
export class TemplateHeaderConfigurationComponent implements OnInit, OnDestroy {
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @Input() alltemplatesData;
  @Input() templateData;
  @Output() gotoNextStep = new EventEmitter<void>();
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  labels: any = {};
  filteredLabels$: Observable<string[]>;
  filteredValues$: Observable<string[]>;
  changedValues: any;
  addNewShow = new BehaviorSubject<boolean>(false);
  headerDataForm: FormGroup;
  errors: ValidationError = {};
  convertedDetail = {};
  readonly formConfigurationStatus = formConfigurationStatus;
  labelSelected: any;
  deletedLabel = '';
  formMetadataSubscription: Subscription;
  hasFormChanges = false;
  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<TemplateModalComponent>,
    private readonly loginService: LoginService,
    private rdfService: RaceDynamicFormService,
    private store: Store<State>,
    private cdrf: ChangeDetectorRef,
    private formProgressService: FormUpdateProgressService
  ) {}

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
        ],
        this.validateTemplateName.bind(this)
      ],
      description: [''],
      isPublic: [false],
      isArchived: [false],
      formStatus: [formConfigurationStatus.draft],
      formType: [formConfigurationStatus.standalone]
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
      this.headerDataForm.markAsDirty();
    }
  }

  next() {
    if (this.headerDataForm.valid) {
      const userEmail = this.loginService.getLoggedInEmail();
      if (this.templateData.templateExists === false) {
        this.rdfService
          .createTemplate$({
            ...this.headerDataForm.value,
            additionalDetails: '',
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
                    state: { allTemplates: this.alltemplatesData }
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
              id: this.templateData.formMetadata.id
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
              id: this.templateData.formMetadata.id
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

  convertArrayToObject(details) {
    details.map((obj) => {
      this.convertedDetail[obj.label] = obj.values;
    });
    return this.convertedDetail;
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
}
