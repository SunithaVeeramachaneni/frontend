import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  Input,
  OnDestroy
} from '@angular/core';
import { LoginService } from 'src/app/components/login/services/login.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  startWith,
  takeUntil,
  tap
} from 'rxjs/operators';

import { isEqual, uniqBy } from 'lodash-es';
import { FormMetadata, Page, ValidationError } from 'src/app/interfaces';

import {
  getFormMetadata,
  getSectionIndexes,
  getFormDetails,
  getCreateOrEditForm,
  getFormSaveStatus,
  getFormPublishStatus,
  getIsFormCreated,
  getQuestionCounter,
  State
} from 'src/app/forms/state';
import { MatDialog } from '@angular/material/dialog';
import { ImportQuestionsModalComponent } from '../import-questions/import-questions-modal/import-questions-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { formConfigurationStatus } from 'src/app/app.constants';
import { FormConfigurationService } from 'src/app/forms/services/form-configuration.service';
import { BuilderConfigurationActions } from 'src/app/forms/state/actions';
import { SaveTemplateContainerComponent } from '../save-template-container/save-template-container.component';
import { RaceDynamicFormService } from '../services/rdf.service';

@Component({
  selector: 'app-form-detail-configuration',
  templateUrl: './form-detail-configuration.component.html',
  styleUrls: ['./form-detail-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormDetailConfigurationComponent implements OnInit, OnDestroy {
  @ViewChild('name') formName: ElementRef;
  @Output() gotoNextStep = new EventEmitter<void>();
  @Input() data;
  selectedNode = { id: null };
  formConfiguration: FormGroup;
  formMetadata$: Observable<FormMetadata>;
  pages$: Observable<Page[]>;
  formDetails$: Observable<any>;
  sectionIndexes$: Observable<any>;
  sectionIndexes: any;
  questionIndexes$: Observable<any>;
  authoredFormDetail$: Observable<any>;
  createOrEditForm$: Observable<boolean>;
  formSaveStatus$: Observable<string>;
  formDetailPublishStatus$: Observable<string>;
  isFormCreated$: Observable<boolean>;
  questionCounter$: Observable<number>;
  formStatus: string;
  formDetailPublishStatus: string;
  isFormDetailPublished: string;
  formMetadata: FormMetadata;
  formListVersion: number;
  public openAppSider$: Observable<any>;
  public openImportTemplateSider$: Observable<any>;
  selectedFormName: string;
  selectedFormData: any;
  allTemplates: any;
  currentFormData: any;
  isEmbeddedForm: boolean;
  errors: ValidationError = {};
  formDetails: any;
  pages: any;
  readonly formConfigurationStatus = formConfigurationStatus;
  authoredFormDetailSubscription: Subscription;
  getFormMetadataSubscription: Subscription;
  private onDestroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private cdrf: ChangeDetectorRef,
    private formConfigurationService: FormConfigurationService,
    private loginService: LoginService,
    private rdfService: RaceDynamicFormService
  ) {}

  ngOnInit(): void {
    this.formConfiguration = this.fb.group({
      id: [''],
      formLogo: [''],
      name: new FormControl(
        {
          value: '',
          disabled: true
        },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ),
      description: [''],
      counter: [0],
      formStatus: [formConfigurationStatus.draft]
    });

    this.formConfiguration.valueChanges
      .pipe(
        startWith({}),
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

            if (
              !isEqual(prev, curr) &&
              ((prev.name !== undefined && curr.name !== undefined) ||
                prev.description !== curr.description)
            ) {
              this.store.dispatch(
                BuilderConfigurationActions.updateFormMetadata({
                  formMetadata: curr,
                  ...this.getFormConfigurationStatuses()
                })
              );

              this.store.dispatch(
                BuilderConfigurationActions.updateForm({
                  formMetadata: this.formMetadata,
                  formListDynamoDBVersion: this.formListVersion
                })
              );
            }
          }
        })
      )
      .subscribe();

    this.formMetadata$ = this.store.select(getFormMetadata).pipe(
      tap((formMetadata) => {
        const { name, description, id, formLogo, formStatus, formType } =
          formMetadata;
        this.formMetadata = formMetadata;
        this.isEmbeddedForm = formType === formConfigurationStatus.embedded;
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
    this.sectionIndexes$ = this.store
      .select(getSectionIndexes)
      .pipe(tap((sectionIndexes) => (this.sectionIndexes = sectionIndexes)));
    this.isFormCreated$ = this.store.select(getIsFormCreated).pipe(
      tap((isFormCreated) => {
        if (isFormCreated) {
          // This will cause some delay in redirection post creation of fresh form. This is only added here to reduce multiple form creations in development process
          // this.router.navigate(['/forms/edit', this.formConf.id.value]);
        }
      })
    );

    this.authoredFormDetail$ = this.store.select(getFormDetails).pipe(
      tap((formDetails) => {
        const {
          formMetadata,
          formStatus,
          counter,
          pages,
          authoredFormDetailId,
          authoredFormDetailVersion,
          isFormDetailPublished,
          formDetailId,
          formDetailPublishStatus,
          formSaveStatus,
          formListDynamoDBVersion,
          formDetailDynamoDBVersion,
          authoredFormDetailDynamoDBVersion,
          skipAuthoredDetail
        } = formDetails;

        if (skipAuthoredDetail) {
          return;
        }
        this.formListVersion = formListDynamoDBVersion;
        this.formStatus = formStatus;
        this.formDetailPublishStatus = formDetailPublishStatus;
        const { id: formListId } = formMetadata;
        this.isFormDetailPublished = isFormDetailPublished;
        this.pages = pages;

        if (formListId) {
          if (authoredFormDetailId && authoredFormDetailId.length) {
            if (
              formSaveStatus !== formConfigurationStatus.saved &&
              formStatus !== formConfigurationStatus.published &&
              !isEqual(this.formDetails, formDetails)
            ) {
              this.store.dispatch(
                BuilderConfigurationActions.updateAuthoredFormDetail({
                  formStatus,
                  formDetailPublishStatus,
                  formListId,
                  counter,
                  pages,
                  authoredFormDetailId,
                  authoredFormDetailVersion,
                  authoredFormDetailDynamoDBVersion
                })
              );
              if (
                formMetadata.lastModifiedBy !==
                this.loginService.getLoggedInUserName()
              ) {
                this.store.dispatch(
                  BuilderConfigurationActions.updateFormMetadata({
                    formMetadata: {
                      ...formMetadata,
                      lastModifiedBy: this.loginService.getLoggedInUserName()
                    },
                    ...this.getFormConfigurationStatuses()
                  })
                );

                this.store.dispatch(
                  BuilderConfigurationActions.updateForm({
                    formMetadata: {
                      ...formMetadata,
                      lastModifiedBy: this.loginService.getLoggedInUserName()
                    },
                    formListDynamoDBVersion: this.formListVersion
                  })
                );
              }
              this.formDetails = formDetails;
            }
          } else {
            this.store.dispatch(
              BuilderConfigurationActions.createAuthoredFormDetail({
                formStatus,
                formDetailPublishStatus,
                formListId,
                counter,
                pages,
                authoredFormDetailVersion
              })
            );
          }

          if (isFormDetailPublished && formDetailId) {
            this.store.dispatch(
              BuilderConfigurationActions.updateFormDetail({
                formMetadata,
                formListId,
                pages,
                formDetailId,
                formDetailDynamoDBVersion,
                authoredFormDetail: {
                  formStatus,
                  formListId,
                  counter,
                  pages,
                  authoredFormDetailVersion,
                  authoredFormDetailDynamoDBVersion,
                  authoredFormDetailId
                },
                formListDynamoDBVersion
              })
            );
          } else if (isFormDetailPublished && !formDetailId) {
            this.store.dispatch(
              BuilderConfigurationActions.createFormDetail({
                formMetadata,
                formListId,
                pages,
                authoredFormDetail: {
                  formStatus,
                  formListId,
                  counter,
                  pages,
                  authoredFormDetailVersion,
                  authoredFormDetailDynamoDBVersion,
                  authoredFormDetailId
                },
                formListDynamoDBVersion
              })
            );
          }
        }
      })
    );

    this.createOrEditForm$ = this.store.select(getCreateOrEditForm).pipe(
      tap((createOrEditForm) => {
        if (!createOrEditForm) {
          this.router.navigate(['/forms']);
        }
        if (this.data.formData === null && createOrEditForm) {
          const section = {
            id: 'S1',
            name: 'Section',
            position: 1,
            isOpen: true
          };
          const df = this.formConfigurationService.getDefQues();
          const questions = new Array(4).fill(0).map((q, index) => {
            if (index === 0) {
              return { ...df, name: 'Site Conducted' };
            }
            if (index === 1) {
              return {
                ...df,
                name: 'Conducted On',
                fieldType: this.isEmbeddedForm ? 'DF' : 'DT',
                date: true,
                time: true
              };
            }
            if (index === 2) {
              return { ...df, name: 'Performed By' };
            }
            if (index === 3) {
              return { ...df, name: 'Location', fieldType: 'GAL' };
            }
          });
          this.formConfigurationService.addPage(
            0,
            1,
            4,
            this.sectionIndexes,
            this.formConf.counter.value,
            [{ section, questions }]
          );
        }
      })
    );

    this.formSaveStatus$ = this.store.select(getFormSaveStatus);

    this.formDetailPublishStatus$ = this.store
      .select(getFormPublishStatus)
      .pipe(
        tap(
          (formDetailPublishStatus) =>
            (this.formDetailPublishStatus = formDetailPublishStatus)
        )
      );

    this.route.data.subscribe((data) => {
      if (data.form && Object.keys(data.form).length) {
        this.formConf.counter.setValue(data.form.counter);
      }
    });

    this.route.params.subscribe((params) => {
      if (!params.id) {
        if (window.history.state.selectedTemplate) {
          this.store.dispatch(
            BuilderConfigurationActions.replacePagesAndCounter({
              pages: JSON.parse(
                window.history.state.selectedTemplate
                  .authoredFormTemplateDetails[0].pages
              ),
              counter: window.history.state.selectedTemplate.counter
            })
          );
        } else {
          this.getFormMetadataSubscription = this.store
            .select(getFormMetadata)
            .subscribe((data) => {
              this.isEmbeddedForm =
                data.formType === this.formConfigurationStatus.embedded;
            });
        }
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
    const form = {
      formMetadata: {
        ...this.formMetadata,
        embedddedFormId: this.formMetadata.embeddedFormId
      },
      pages: this.pages
    };

    if (this.isEmbeddedForm) {
      this.rdfService.publishEmbeddedForms$(form).subscribe((response) => {
        form.pages[0].questions.forEach((question) => {
          if (response?.includes(question.id)) {
            question.isPublished = true;
            question.isPublishedTillSave = true;
          }
        });

        const {
          formMetadata,
          formStatus,
          counter,
          authoredFormDetailId,
          authoredFormDetailVersion,
          formDetailPublishStatus,
          authoredFormDetailDynamoDBVersion
        } = this.formDetails;
        this.store.dispatch(
          BuilderConfigurationActions.updateAuthoredFormDetail({
            formStatus,
            formDetailPublishStatus,
            formListId: formMetadata.id,
            counter,
            pages: form.pages,
            authoredFormDetailId,
            authoredFormDetailVersion,
            authoredFormDetailDynamoDBVersion
          })
        );

        this.store.dispatch(
          BuilderConfigurationActions.updateFormPublishStatus({
            formDetailPublishStatus: formConfigurationStatus.publishing
          })
        );
        this.store.dispatch(
          BuilderConfigurationActions.updateIsFormDetailPublished({
            isFormDetailPublished: true
          })
        );

        this.router.navigate(['/forms']);
      });
    } else {
      this.store.dispatch(
        BuilderConfigurationActions.updateFormPublishStatus({
          formDetailPublishStatus: formConfigurationStatus.publishing
        })
      );
      this.store.dispatch(
        BuilderConfigurationActions.updateIsFormDetailPublished({
          isFormDetailPublished: true
        })
      );
    }
  }

  getFormConfigurationStatuses() {
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

  importQuestions(tabIndex): void {
    const dialogRef = this.dialog.open(ImportQuestionsModalComponent, {
      data: {
        selectedFormData: '',
        selectedFormName: '',
        openImportQuestionsSlider: false,
        openImportTemplateQuestionsSlider: false,
        isEmbeddedForm: this.isEmbeddedForm,
        allTemplates: [],
        tabIndex
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.selectedFormData = result.selectedFormData;
      this.allTemplates = result.allTemplates;
      this.selectedFormName = result.selectedFormName;
      this.authoredFormDetailSubscription = this.authoredFormDetail$.subscribe(
        (pagesData) => {
          this.currentFormData = pagesData;
        }
      );
      this.openAppSider$ = of(result.openImportQuestionsSlider);
      this.openImportTemplateSider$ = of(
        result.openImportTemplateQuestionsSlider
      );
      this.cdrf.markForCheck();
    });
  }

  cancelSlider(event) {
    this.openAppSider$ = of(event);
  }

  backSlider(event) {
    this.openAppSider$ = of(event);
    this.importQuestions(1);
  }

  cancelTemplateSlider(event) {
    this.openImportTemplateSider$ = of(event);
  }

  backTemplateSlider(event) {
    this.openImportTemplateSider$ = of(event);
    this.importQuestions(0);
  }

  publishOrShowPdf() {
    if (!this.isEmbeddedForm) {
      this.goToPDFBuilderConfiguration();
    } else {
      // PUBLISH FORM TO SAP AND DYNAMODB
      this.publishFormDetail();
    }
  }

  goToPDFBuilderConfiguration = () => {
    this.gotoNextStep.emit();
  };

  openSaveTemplateDialog() {
    this.dialog.open(SaveTemplateContainerComponent, {
      data: this.formDetails
    });
  }

  ngOnDestroy(): void {
    if (this.authoredFormDetailSubscription) {
      this.authoredFormDetailSubscription.unsubscribe();
    }
    if (this.getFormMetadataSubscription) {
      this.getFormMetadataSubscription.unsubscribe();
    }
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
