import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
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
  startWith,
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
import { BuilderConfigurationActions } from 'src/app/forms/state/actions';
import { ActivatedRoute, Router } from '@angular/router';
import { formConfigurationStatus } from 'src/app/app.constants';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { MatDialog } from '@angular/material/dialog';
import { RaceDynamicFormService } from '../services/rdf.service';
import { EditTemplateNameModalComponent } from '../edit-template-name-modal/edit-template-name-modal.component';
import { TemplateAffectedFormsModalComponent } from './template-affected-forms-modal/template-affected-forms-modal.component';
import { FormUpdateProgressService } from 'src/app/forms/services/form-update-progress.service';
import { FormService } from 'src/app/forms/services/form.service';

@Component({
  selector: 'app-template-detail-configuration',
  templateUrl: './template-detail-configuration.component.html',
  styleUrls: ['./template-detail-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateDetailConfigurationComponent implements OnInit, OnDestroy {
  @ViewChild('name') formName: ElementRef;
  @Output() markReadyEvent = new EventEmitter<void>();
  collapseAllSections: FormControl = new FormControl(false);
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
  isEmbeddedTemplate: boolean;
  isTemplate = true;
  affectedForms: any;
  readonly formConfigurationStatus = formConfigurationStatus;
  private allTemplates: any[];
  private onDestroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private formProgressService: FormUpdateProgressService,
    private formService: FormService,
    private readonly raceDynamicFormService: RaceDynamicFormService
  ) {}

  ngOnInit(): void {
    this.raceDynamicFormService
      .getDataSetsByType$('formTemplateDetailTags')
      .subscribe((tags) => {
        if (tags && tags.length)
          this.formService.setDetailLevelTagsState(tags[0].values);
      });

    this.retrieveDetails();

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
      formStatus: [formConfigurationStatus.draft],
      formType: formConfigurationStatus.standalone
    });

    // if accessed from list screen, allTemplates will be in router state
    // otherwise, we have to make the network call ourselves
    if (window.history.state.allTemplates) {
      // waiting for the store to catchup before filtering
      setTimeout(() => {
        this.allTemplates = window.history.state.allTemplates.filter(
          (item) => item.id !== this.formDetails?.formMetadata?.id
        );
      }, 1000);
    } else {
      this.raceDynamicFormService
        .fetchTemplates$({ isArchived: false, isDeleted: false })
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((res) => {
          this.allTemplates = res.rows.filter(
            (item) => item.id !== this.formDetails?.formMetadata?.id
          );
        });
    }
    this.formSaveStatus$ = this.store.select(getFormSaveStatus);

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
              } else if (prev.description !== curr.description) {
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
        const { name, description, id, formLogo, formStatus, formType } =
          formMetadata;
        this.formMetadata = formMetadata;
        this.isEmbeddedTemplate =
          formMetadata.formType === formConfigurationStatus.embedded;
        this.formConfiguration.patchValue(
          {
            name,
            description,
            id,
            formLogo,
            formStatus,
            formType
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

    this.authoredTemplateDetail$ = this.store.select(getFormDetails).pipe(
      tap((formDetails) => {
        const {
          formMetadata,
          counter,
          formStatus,
          pages,
          isFormDetailPublished,
          formSaveStatus,
          skipAuthoredDetail
        } = formDetails;
        this.setCollapseAllSectionsState(pages);

        if (skipAuthoredDetail) {
          return;
        }
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
          this.formProgressService.formUpdateDeletePayloadBuffer$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((data) => {
              this.formProgressService.formUpdateDeletePayload$.next(data);
            });
          this.markReadyEvent.emit();
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
    this.collapseAllSections.valueChanges.subscribe((isCollapse) => {
      this.store.dispatch(
        BuilderConfigurationActions.updateAllSectionState({
          isCollapse,
          subFormId: this.selectedNode.id
        })
      );
    });
  }

  retrieveDetails() {
    this.raceDynamicFormService
      .getAdditionalDetails$({
        type: 'formTemplates',
        level: 'detail'
      })
      .subscribe((details: any[]) => {
        const labels = this.convertArrayToObject(details);
        const attributesIdMap = {};
        details.forEach((data) => {
          attributesIdMap[data.label] = data.id;
        });
        this.formService.setDetailLevelAttributesState({
          labels,
          attributesIdMap
        });
      });
  }

  convertArrayToObject(details) {
    const convertedDetail = {};
    details.map((obj) => {
      convertedDetail[obj.label] = obj.values;
    });
    return convertedDetail;
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
    const templateDialogRef = this.dialog.open(
      TemplateAffectedFormsModalComponent,
      {
        maxWidth: '50vw',
        maxHeight: '82vh',
        height: '100%',
        width: '100%',
        data: {
          templateId: this.formMetadata.id,
          templateType: this.formMetadata.formType
        }
      }
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
  }

  private setCollapseAllSectionsState(pages = []) {
    if (pages?.length === 0) {
      this.collapseAllSections.setValue(false, {
        emitEvent: false
      });
      return;
    }
    let allSections = 0;
    let closedSections = 0;
    if (pages?.length > 0) {
      pages.forEach((page) => {
        allSections += page?.sections?.length;
        closedSections +=
          page?.sections?.filter((section) => !section?.isOpen)?.length || 0;
      });
    }
    const allCollapse: boolean = closedSections === allSections ? true : false;
    this.collapseAllSections.setValue(allCollapse, {
      emitEvent: false
    });
  }
}
