import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  takeUntil,
  tap
} from 'rxjs/operators';

import { isEqual } from 'lodash-es';
import { FormMetadata, Page, ValidationError } from 'src/app/interfaces';

import {
  getFormMetadata,
  getFormDetails,
  getCreateOrEditForm,
  getFormSaveStatus,
  getQuestionCounter,
  State
} from 'src/app/forms/state';
import {
  BuilderConfigurationActions,
  GlobalResponseActions,
  QuickResponseActions,
  UnitOfMeasurementActions
} from 'src/app/forms/state/actions';
import { HeaderService } from 'src/app/shared/services/header.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ActivatedRoute, Router } from '@angular/router';
import { formConfigurationStatus } from 'src/app/app.constants';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { MatDialog } from '@angular/material/dialog';
import { RaceDynamicFormService } from '../services/rdf.service';
import { EditTemplateNameModalComponent } from '../edit-template-name-modal/edit-template-name-modal.component';

@Component({
  selector: 'app-template-configuration',
  templateUrl: './template-configuration.component.html',
  styleUrls: ['./template-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateConfigurationComponent implements OnInit, OnDestroy {
  @ViewChild('name') formName: ElementRef;
  selectedNode = { id: null };
  formConfiguration: FormGroup;
  formMetadata$: Observable<FormMetadata>;
  pages$: Observable<Page[]>;
  formDetails$: Observable<any>;
  authoredTemplateDetail$: Observable<any>;
  createOrEditForm$: Observable<boolean>;
  formSaveStatus$: Observable<string>;
  isFormCreated$: Observable<boolean>;
  questionCounter$: Observable<number>;
  formStatus: string;
  isTemplatePublishing: boolean;
  formMetadata: FormMetadata;
  formListVersion: number;
  errors: ValidationError = {};
  formDetails: any;
  readonly formConfigurationStatus = formConfigurationStatus;
  private allTemplates: any[];
  private onDestroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    private headerService: HeaderService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private readonly raceDynamicFormService: RaceDynamicFormService
  ) {}

  ngOnInit(): void {
    this.formConfiguration = this.fb.group({
      formLogo: [''],
      name: new FormControl(
        {
          value: '',
          disabled: true
        },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ),
      description: [''],
      counter: [0],
      formStatus: [formConfigurationStatus.draft]
    });

    // if accessed from list screen, allTemplates will be in router state
    // otherwise, we have to make the network call ourselves
    if (window.history.state.allTemplates) {
      // waiting for the store to catchup before filtering
      setTimeout(() => {
        this.allTemplates = window.history.state.allTemplates.filter(
          (item) => item.id !== this.formDetails.formMetadata.id
        );
      }, 1000);
    } else {
      this.raceDynamicFormService.fetchAllTemplates$().subscribe((res) => {
        this.allTemplates = res.rows.filter(
          (item) => item.id !== this.formDetails.formMetadata.id
        );
      });
    }
    this.formSaveStatus$ = this.store.select(getFormSaveStatus);

    this.formConfiguration.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        pairwise(),
        tap(([previous, current]) => {
          if (!this.formConfiguration.invalid) {
            const {
              counter: prevCounter,
              id: prevId,
              formStatus: prevFormStatus,
              ...prev
            } = previous;
            const {
              counter: currCounter,
              id: currId,
              formStatus: currFormStatus,
              ...curr
            } = current;

            if (!isEqual(prev, curr)) {
              if (
                prev.name !== curr.name &&
                this.allTemplates
                  .map((item) => item.name)
                  .indexOf(curr.name) !== -1
              ) {
                const oldTemplateId = this.allTemplates.find(
                  (item) =>
                    item.name === this.formConfiguration.get('name').value
                ).id;
                const templateName = this.formConfiguration.get('name').value;
                const dialogRef = this.dialog.open(
                  EditTemplateNameModalComponent,
                  {
                    data: {
                      templateId: oldTemplateId,
                      templateName
                    }
                  }
                );
                dialogRef.afterClosed().subscribe((res) => {
                  if (res) {
                    this.allTemplates = this.allTemplates.filter(
                      (item) => item.id !== oldTemplateId
                    );
                    this.store.dispatch(
                      BuilderConfigurationActions.updateFormMetadata({
                        formMetadata: curr,
                        ...this.getDraftFormConfigurationStatuses()
                      })
                    );

                    this.store.dispatch(
                      BuilderConfigurationActions.updateTemplate({
                        formMetadata: this.formMetadata
                      })
                    );
                  }
                });
              } else {
                this.store.dispatch(
                  BuilderConfigurationActions.updateFormMetadata({
                    formMetadata: curr,
                    ...this.getDraftFormConfigurationStatuses()
                  })
                );

                this.store.dispatch(
                  BuilderConfigurationActions.updateTemplate({
                    formMetadata: this.formMetadata
                  })
                );
              }
            }
          }
        })
      )
      .subscribe();

    this.formMetadata$ = this.store.select(getFormMetadata).pipe(
      tap((formMetadata) => {
        const { name, description, id, formLogo, formStatus } = formMetadata;
        this.formMetadata = formMetadata;
        this.formConfiguration.patchValue(
          {
            name,
            description,
            id,
            formLogo,
            formStatus
          },
          { emitEvent: false }
        );
        const formName = name ? name : 'Untitled Form';
        this.headerService.setHeaderTitle(formName);
        this.breadcrumbService.set('@templateName', {
          label: formName
        });
      })
    );
    this.questionCounter$ = this.store.select(getQuestionCounter).pipe(
      tap((counter) => {
        this.formConfiguration.patchValue(
          {
            counter
          },
          { emitEvent: false }
        );
      })
    );

    this.authoredTemplateDetail$ = this.store.select(getFormDetails).pipe(
      tap((formDetails) => {
        const {
          formMetadata,
          counter,
          formStatus,
          pages,
          isFormDetailPublished,
          formSaveStatus
        } = formDetails;
        const { id: templateId } = formMetadata;
        this.formStatus = formStatus;
        this.isTemplatePublishing = isFormDetailPublished;

        if (pages.length && templateId) {
          if (!this.formDetails) {
            this.formDetails = formDetails;
          } else if (this.isTemplatePublishing) {
            this.store.dispatch(
              BuilderConfigurationActions.publishTemplate({
                formMetadata,
                data: {
                  formStatus: formConfigurationStatus.ready,
                  templateId,
                  counter,
                  pages
                }
              })
            );
          } else if (
            formSaveStatus !== formConfigurationStatus.saved &&
            !isEqual(this.formDetails, formDetails)
          ) {
            this.store.dispatch(
              BuilderConfigurationActions.createAuthoredTemplateDetail({
                formStatus,
                templateId,
                counter,
                pages
              })
            );
            this.formDetails = formDetails;
          }
        }
      })
    );

    this.createOrEditForm$ = this.store.select(getCreateOrEditForm).pipe(
      tap((createOrEditForm) => {
        if (!createOrEditForm) {
          this.router.navigate(['/forms/templates']);
        }
      })
    );

    this.route.data.subscribe((data) => {
      if (data.form && Object.keys(data.form).length) {
        this.formConf.counter.setValue(data.form.counter);
        this.store.dispatch(
          BuilderConfigurationActions.updateFormConfiguration({
            formConfiguration: data.form
          })
        );
        data.form.pages.forEach((page, index) => {
          if (index === 0) {
            this.store.dispatch(
              BuilderConfigurationActions.updatePageState({
                pageIndex: index,
                isOpen: false,
                subFormId: null
              })
            );
            this.store.dispatch(
              BuilderConfigurationActions.updatePageState({
                pageIndex: index,
                isOpen: true,
                subFormId: null
              })
            );
          } else {
            this.store.dispatch(
              BuilderConfigurationActions.updatePageState({
                pageIndex: index,
                isOpen: false,
                subFormId: null
              })
            );
          }
        });
      }
    });
  }

  editFormName() {
    this.formConfiguration.get('name').enable();
    this.formName.nativeElement.focus();
  }

  getSize(value) {
    if (value && value === value.toUpperCase()) {
      return value.length;
    }
    return value.length - 1;
  }

  get formConf() {
    return this.formConfiguration.controls;
  }

  uploadFormImageFile(e) {
    // uploaded image  file code
  }

  publishFormDetail() {
    this.store.dispatch(
      BuilderConfigurationActions.updateIsFormDetailPublished({
        isFormDetailPublished: true
      })
    );
  }

  getDraftFormConfigurationStatuses() {
    return {
      formStatus: formConfigurationStatus.draft,
      formDetailPublishStatus: formConfigurationStatus.draft,
      formSaveStatus: formConfigurationStatus.saving
    };
  }

  processValidationErrors(controlName: string): boolean {
    const touched = this.formConfiguration.get(controlName).touched;
    const errors = this.formConfiguration.get(controlName).errors;
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

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.store.dispatch(BuilderConfigurationActions.resetFormConfiguration());
    this.store.dispatch(UnitOfMeasurementActions.resetUnitOfMeasurementList());
    this.store.dispatch(QuickResponseActions.resetQuickResponses());
    this.store.dispatch(GlobalResponseActions.resetGlobalResponses());
  }
}
