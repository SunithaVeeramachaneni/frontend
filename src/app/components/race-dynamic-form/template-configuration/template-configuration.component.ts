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
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  tap
} from 'rxjs/operators';

import { isEqual } from 'lodash-es';
import {
  PageEvent,
  QuestionEvent,
  SectionEvent,
  FormMetadata,
  Page,
  Question,
  Section,
  ValidationError
} from 'src/app/interfaces';

import {
  getSectionQuestions,
  getFormMetadata,
  getPageIndexes,
  getQuestionIndexes,
  getSectionIds,
  getSectionIndexes,
  getFormDetails,
  getPage,
  getCreateOrEditForm,
  getFormSaveStatus,
  getIsFormCreated,
  getQuestionIds,
  getQuestionCounter,
  State
} from 'src/app/forms/state';
import { BuilderConfigurationActions } from 'src/app/forms/state/actions';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { HeaderService } from 'src/app/shared/services/header.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ActivatedRoute, Router } from '@angular/router';
import { formConfigurationStatus } from 'src/app/app.constants';
import { FormConfigurationService } from 'src/app/forms/services/form-configuration.service';
import { ResponseSetService } from '../../master-configurations/response-set/services/response-set.service';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';

@Component({
  selector: 'app-template-configuration',
  templateUrl: './template-configuration.component.html',
  styleUrls: ['./template-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateConfigurationComponent implements OnInit, OnDestroy {
  @ViewChild('name') formName: ElementRef;
  formConfiguration: FormGroup;
  formMetadata$: Observable<FormMetadata>;
  pageIndexes$: Observable<number[]>;
  pages$: Observable<Page[]>;
  formDetails$: Observable<any>;
  sectionIndexes$: Observable<any>;
  sectionIndexes: any;
  sectionIds$: Observable<any>;
  questionIds$: Observable<any>;
  questionIndexes$: Observable<any>;
  authoredTemplateDetail$: Observable<any>;
  createOrEditForm$: Observable<boolean>;
  formSaveStatus$: Observable<string>;
  isFormCreated$: Observable<boolean>;
  questionCounter$: Observable<number>;
  questionIndexes: any;
  formStatus: string;
  isTemplatePublishing: boolean;
  formMetadata: FormMetadata;
  formListVersion: number;
  errors: ValidationError = {};
  formDetails: any;
  readonly formConfigurationStatus = formConfigurationStatus;

  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    private responseSetService: ResponseSetService,
    private headerService: HeaderService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private formConfigurationService: FormConfigurationService
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

    this.responseSetService.fetchAllGlobalResponses$().subscribe();
    this.formSaveStatus$ = this.store.select(getFormSaveStatus);

    this.formConfiguration.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
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
              this.store.dispatch(
                BuilderConfigurationActions.updateFormMetadata({
                  formMetadata: curr,
                  ...this.getFormConfigurationStatuses()
                })
              );

              this.store.dispatch(
                BuilderConfigurationActions.updateTemplate({
                  formMetadata: this.formMetadata
                })
              );
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
    this.pageIndexes$ = this.store.select(getPageIndexes);
    this.sectionIndexes$ = this.store
      .select(getSectionIndexes)
      .pipe(tap((sectionIndexes) => (this.sectionIndexes = sectionIndexes)));
    this.sectionIds$ = this.store.select(getSectionIds);
    this.questionIds$ = this.store.select(getQuestionIds);
    this.questionIndexes$ = this.store
      .select(getQuestionIndexes)
      .pipe(tap((questionIndexes) => (this.questionIndexes = questionIndexes)));
    this.isFormCreated$ = this.store.select(getIsFormCreated).pipe(
      tap((isFormCreated) => {
        if (isFormCreated) {
          // This will cause some delay in redirection post creation of fresh form. This is only added here to reduce multiple form creations in development process
          // this.router.navigate(['/forms/edit', this.formConf.id.value]);
        }
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

    this.route.params.subscribe((params) => {
      if (!params.id) {
        let section = { id: 'S1', name: 'Section', position: 1, isOpen: true };
        let df = this.formConfigurationService.getDefQues();
        let questions = new Array(4).fill(0).map((q, index) => {
          if (index === 0) {
            return { ...df, name: 'Site Conducted' };
          }
          if (index === 1) {
            return {
              ...df,
              name: 'Conducted On',
              fieldType: 'DT',
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

  pageEventHandler(event: PageEvent) {
    const { pageIndex, type, page } = event;
    switch (type) {
      case 'add':
        {
          this.formConfigurationService.addPage(
            pageIndex,
            1,
            1,
            this.sectionIndexes,
            this.formConf.counter.value
          );
        }
        break;
      case 'update':
        this.store.dispatch(
          BuilderConfigurationActions.updatePage({
            page,
            pageIndex,
            ...this.getFormConfigurationStatuses(),
            subFormId: null
          })
        );
        break;

      case 'delete':
        this.store.dispatch(
          BuilderConfigurationActions.deletePage({
            pageIndex,
            ...this.getFormConfigurationStatuses(),
            subFormId: null
          })
        );
        break;
    }
  }

  sectionEventHandler(event: SectionEvent) {
    const { pageIndex, sectionIndex, section, type } = event;
    switch (type) {
      case 'add':
        {
          this.formConfigurationService.addSections(
            pageIndex,
            1,
            1,
            sectionIndex,
            this.sectionIndexes,
            this.formConf.counter.value
          );
        }
        break;

      case 'update':
        this.store.dispatch(
          BuilderConfigurationActions.updateSection({
            section,
            sectionIndex,
            pageIndex,
            ...this.getFormConfigurationStatuses(),
            subFormId: null
          })
        );
        break;

      case 'delete':
        this.store.dispatch(
          BuilderConfigurationActions.deleteSection({
            sectionIndex,
            sectionId: section.id,
            pageIndex,
            ...this.getFormConfigurationStatuses(),
            subFormId: null
          })
        );
        break;
    }
  }

  questionEventHandler(event: QuestionEvent) {
    const { pageIndex, questionIndex, sectionId, question, type } = event;
    switch (type) {
      case 'add':
        {
          this.formConfigurationService.addQuestions(
            pageIndex,
            sectionId,
            1,
            questionIndex,
            this.formConf.counter.value
          );
        }
        break;

      case 'update':
        this.store.dispatch(
          BuilderConfigurationActions.updateQuestion({
            question,
            questionIndex,
            sectionId,
            pageIndex,
            ...this.getFormConfigurationStatuses(),
            subFormId: null
          })
        );
        break;

      case 'delete':
        this.store.dispatch(
          BuilderConfigurationActions.deleteQuestion({
            questionIndex,
            sectionId,
            pageIndex,
            ...this.getFormConfigurationStatuses(),
            subFormId: null
          })
        );
        break;
    }
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

  dropSection(event: CdkDragDrop<any>, pageIndex: number) {
    const data = event.container.data.slice();

    if (event.previousContainer === event.container) {
      moveItemInArray(data, event.previousIndex, event.currentIndex);
      const sectionPositionMap = {};
      data.forEach((section: Section, index) => {
        sectionPositionMap[section.id] = index + 1;
      });
      this.store.dispatch(
        BuilderConfigurationActions.updatePageSections({
          pageIndex,
          data: sectionPositionMap,
          ...this.getFormConfigurationStatuses(),
          subFormId: null
        })
      );
    }
  }

  drop(event: CdkDragDrop<any>, pageIndex, sectionId) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      event.container.data.forEach((question: Question, index) => {
        this.store.dispatch(
          BuilderConfigurationActions.updateQuestionBySection({
            question: Object.assign({}, question, {
              position: index + 1,
              sectionId
            }),
            sectionId,
            pageIndex,
            ...this.getFormConfigurationStatuses(),
            subFormId: null
          })
        );
      });
    } else {
      const questionId = event.previousContainer.data[event.previousIndex].id;
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.store.dispatch(
        BuilderConfigurationActions.transferQuestionFromSection({
          questionId,
          currentIndex: event.currentIndex,
          previousIndex: event.previousIndex,
          sourceSectionId: event.previousContainer.id,
          destinationSectionId: event.container.id,
          pageIndex,
          ...this.getFormConfigurationStatuses(),
          subFormId: null
        })
      );
    }
  }

  getQuestionsOfSection(pageIndex, sectionIndex) {
    let sectionQuestions;
    this.store
      .select(getSectionQuestions(pageIndex, sectionIndex))
      .subscribe((v) => (sectionQuestions = v));
    return sectionQuestions;
  }

  getSectionsOfPage(pageIndex) {
    let pageSections;
    this.store
      .select(getPage(pageIndex))
      .subscribe((v) => (pageSections = v?.sections));
    return pageSections;
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

  ngOnDestroy(): void {
    this.store.dispatch(BuilderConfigurationActions.resetFormConfiguration());
  }

  addQuestion(pageIndex, sectionIndex, questionIndex) {
    this.formConfigurationService.addQuestions(
      pageIndex,
      sectionIndex,
      1,
      questionIndex,
      this.formConf.counter.value
    );
  }
}
