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
  State,
  getPage,
  getCreateOrEditForm,
  getFormSaveStatus,
  getFormPublishStatus,
  getIsFormCreated,
  getQuestionIds
} from 'src/app/forms/state';
import {
  FormConfigurationActions,
  MCQResponseActions
} from 'src/app/forms/state/actions';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { HeaderService } from 'src/app/shared/services/header.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ActivatedRoute, Router } from '@angular/router';
import { formConfigurationStatus } from 'src/app/app.constants';

@Component({
  selector: 'app-form-configuration',
  templateUrl: './form-configuration.component.html',
  styleUrls: ['./form-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormConfigurationComponent implements OnInit, OnDestroy {
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
  authoredFormDetail$: Observable<any>;
  createOrEditForm$: Observable<boolean>;
  formSaveStatus$: Observable<string>;
  formDetailPublishStatus$: Observable<string>;
  isFormCreated$: Observable<boolean>;
  questionIndexes: any;
  formStatus: string;
  formDetailPublishStatus: string;
  isFormDetailPublished: string;
  formMetadata: FormMetadata;
  formListVersion: number;
  errors: ValidationError = {};
  readonly formConfigurationStatus = formConfigurationStatus;

  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    private headerService: HeaderService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute
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

    const fornName = this.formConf.name.value
      ? this.formConf.name.value
      : 'Untitled Form';
    this.headerService.setHeaderTitle(fornName);
    this.breadcrumbService.set('@formName', {
      label: fornName
    });
    this.store.dispatch(
      MCQResponseActions.getResponseSet({ responseType: 'globalResponse' })
    );
    this.formConfiguration.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        pairwise(),
        tap(([previous, current]) => {
          if (!this.formConfiguration.invalid) {
            const { counter: prevCounter, id: prevId, ...prev } = previous;
            const { counter: currCounter, id: currId, ...curr } = current;

            if (!isEqual(prev, curr)) {
              this.store.dispatch(
                FormConfigurationActions.updateFormMetadata({
                  formMetadata: curr,
                  ...this.getFormConfigurationStatuses()
                })
              );

              this.store.dispatch(
                FormConfigurationActions.updateForm({
                  formMetadata: { ...this.formMetadata, ...curr },
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
        const { name, description, id, formLogo } = formMetadata;
        this.formMetadata = formMetadata;
        this.formConfiguration.patchValue({ name, description, id, formLogo });
        const formName = name ? name : 'Untitled Form';
        this.headerService.setHeaderTitle(formName);
        this.breadcrumbService.set('@formName', {
          label: formName
        });
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

    this.authoredFormDetail$ = this.store.select(getFormDetails).pipe(
      tap(
        ({
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
          authoredFormDetailDynamoDBVersion
        }) => {
          this.formListVersion = formListDynamoDBVersion;
          this.formStatus = formStatus;
          this.formDetailPublishStatus = formDetailPublishStatus;
          const { id: formListId } = formMetadata;
          this.isFormDetailPublished = isFormDetailPublished;
          if (pages.length && formListId) {
            if (authoredFormDetailId) {
              if (formSaveStatus !== 'Saved') {
                this.store.dispatch(
                  FormConfigurationActions.updateAuthoredFormDetail({
                    formStatus,
                    formDetailPublishStatus,
                    formListId,
                    counter,
                    pages,
                    authoredFormDetailId,
                    authoredFormDetailDynamoDBVersion
                  })
                );
              }
            } else {
              this.store.dispatch(
                FormConfigurationActions.createAuthoredFormDetail({
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
                FormConfigurationActions.updateFormDetail({
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
                FormConfigurationActions.createFormDetail({
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
        }
      )
    );

    this.createOrEditForm$ = this.store.select(getCreateOrEditForm).pipe(
      tap((createOrEditForm) => {
        if (!createOrEditForm) {
          this.router.navigate(['/forms']);
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
        this.store.dispatch(
          FormConfigurationActions.updateFormConfiguration({
            formConfiguration: data.form
          })
        );
        data.form.pages.forEach((page, index) => {
          if (index === 0) {
            this.store.dispatch(
              FormConfigurationActions.updatePageState({
                pageIndex: index,
                isOpen: false
              })
            );
            this.store.dispatch(
              FormConfigurationActions.updatePageState({
                pageIndex: index,
                isOpen: true
              })
            );
          } else {
            this.store.dispatch(
              FormConfigurationActions.updatePageState({
                pageIndex: index,
                isOpen: false
              })
            );
          }
        });
      }
    });

    this.route.params.subscribe((params) => {
      if (!params.id) {
        this.store.dispatch(
          FormConfigurationActions.addPage({
            page: this.getPageObject(0, 0, 0),
            pageIndex: 0,
            questionCounter: this.formConf.counter.value,
            ...this.getFormConfigurationStatuses()
          })
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

  getPageObject(
    pageIndex: number,
    sectionIndex: number,
    questionIndex: number
  ) {
    const section = this.getSection(pageIndex, sectionIndex);
    const question = this.getQuestion(questionIndex, section.id);
    return {
      name: 'Page',
      position: pageIndex + 1,
      isOpen: true,
      sections: [section],
      questions: [question],
      logics: []
    };
  }

  getSection(pageIndex: number, sectionIndex: number) {
    return {
      id: `S${
        this.sectionIndexes && this.sectionIndexes[pageIndex]
          ? this.sectionIndexes[pageIndex].length + 1
          : 1
      }`,
      name: 'Section',
      position: sectionIndex + 1,
      isOpen: true
    };
  }

  getQuestion(questionIndex: number, sectionId: string) {
    this.formConf.counter.setValue(this.formConf.counter.value + 1);
    return {
      id: `Q${this.formConf.counter.value}`,
      sectionId,
      name: '',
      fieldType: 'TF',
      position: questionIndex + 1,
      required: false,
      multi: false,
      value: 'TF',
      isPublished: false,
      isPublishedTillSave: false,
      isOpen: true,
      isResponseTypeModalOpen: false
    };
  }

  pageEventHandler(event: PageEvent) {
    const { pageIndex, type } = event;
    switch (type) {
      case 'add':
        {
          const page = this.getPageObject(pageIndex, 0, 0);
          this.store.dispatch(
            FormConfigurationActions.addPage({
              page,
              pageIndex,
              questionCounter: this.formConf.counter.value,
              ...this.getFormConfigurationStatuses()
            })
          );
          this.store.dispatch(
            FormConfigurationActions.updateQuestionState({
              questionId: page.questions[0].id,
              isOpen: true,
              isResponseTypeModalOpen: false
            })
          );
        }
        break;

      case 'delete':
        this.store.dispatch(
          FormConfigurationActions.deletePage({
            pageIndex,
            ...this.getFormConfigurationStatuses()
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
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const section = this.getSection(pageIndex, sectionIndex);
          const question = this.getQuestion(0, section.id);
          this.store.dispatch(
            FormConfigurationActions.addSection({
              section,
              question,
              pageIndex,
              sectionIndex,
              questionCounter: this.formConf.counter.value,
              ...this.getFormConfigurationStatuses()
            })
          );
          this.store.dispatch(
            FormConfigurationActions.updateQuestionState({
              questionId: question.id,
              isOpen: true,
              isResponseTypeModalOpen: false
            })
          );
        }
        break;

      case 'update':
        this.store.dispatch(
          FormConfigurationActions.updateSection({
            section,
            sectionIndex,
            pageIndex,
            ...this.getFormConfigurationStatuses()
          })
        );
        break;

      case 'delete':
        this.store.dispatch(
          FormConfigurationActions.deleteSection({
            sectionIndex,
            sectionId: section.id,
            pageIndex,
            ...this.getFormConfigurationStatuses()
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
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const question = this.getQuestion(questionIndex, sectionId);
          this.store.dispatch(
            FormConfigurationActions.addQuestion({
              question,
              pageIndex,
              sectionId,
              questionIndex,
              questionCounter: this.formConf.counter.value,
              ...this.getFormConfigurationStatuses()
            })
          );
          this.store.dispatch(
            FormConfigurationActions.updateQuestionState({
              questionId: question.id,
              isOpen: true,
              isResponseTypeModalOpen: false
            })
          );
        }
        break;

      case 'update':
        this.store.dispatch(
          FormConfigurationActions.updateQuestion({
            question,
            questionIndex,
            sectionId,
            pageIndex,
            ...this.getFormConfigurationStatuses()
          })
        );
        break;

      case 'delete':
        this.store.dispatch(
          FormConfigurationActions.deleteQuestion({
            questionIndex,
            sectionId,
            pageIndex,
            ...this.getFormConfigurationStatuses()
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
      FormConfigurationActions.updateFormPublishStatus({
        formDetailPublishStatus: formConfigurationStatus.publishing
      })
    );
    this.store.dispatch(
      FormConfigurationActions.updateIsFormDetailPublished({
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
        FormConfigurationActions.updatePageSections({
          pageIndex,
          data: sectionPositionMap,
          ...this.getFormConfigurationStatuses()
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
          FormConfigurationActions.updateQuestionBySection({
            question: Object.assign({}, question, {
              position: index + 1,
              sectionId
            }),
            sectionId,
            pageIndex,
            ...this.getFormConfigurationStatuses()
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
        FormConfigurationActions.transferQuestionFromSection({
          questionId,
          currentIndex: event.currentIndex,
          previousIndex: event.previousIndex,
          sourceSectionId: event.previousContainer.id,
          destinationSectionId: event.container.id,
          pageIndex,
          ...this.getFormConfigurationStatuses()
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
    this.store.dispatch(FormConfigurationActions.resetFormConfiguration());
  }
}
