import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  Section
} from 'src/app/interfaces';

import {
  getSectionQuestions,
  getFormMetadata,
  getPageIndexes,
  getPages,
  getQuestionIndexes,
  getSectionIds,
  getSectionIndexes,
  getFormDetails,
  State,
  getPage
} from 'src/app/forms/state';
import { RaceDynamicFormService } from '../services/rdf.service';
import { FormConfigurationActions } from 'src/app/forms/state/actions';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-form-configuration',
  templateUrl: './form-configuration.component.html',
  styleUrls: ['./form-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormConfigurationComponent implements OnInit, OnDestroy {
  formConfiguration: FormGroup;
  formMetadata$: Observable<FormMetadata>;
  pageIndexes$: Observable<number[]>;
  pages$: Observable<Page[]>;
  formDetails$: Observable<any>;
  sectionIndexes$: Observable<any>;
  sectionIndexes: any;
  sectionIds$: Observable<any>;
  questionIndexes$: Observable<any>;
  authoredFormDetail$: Observable<any>;
  questionIndexes: any;
  saveStatus = 'done';
  formMetaData: FormMetadata;
  fieldContentOpenState = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    private raceDynamicFormService: RaceDynamicFormService
  ) {}

  ngOnInit(): void {
    this.formConfiguration = this.fb.group({
      id: [''],
      formLogo: [''],
      name: [''],
      description: [''],
      counter: [0],
      formStatus: ['Draft']
    });

    this.formConfiguration.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        pairwise(),
        tap(([previous, current]) => {
          const { counter: prevCounter, ...prev } = previous;
          const { counter: currCounter, ...curr } = current;

          if (!isEqual(previous, current)) {
            this.store.dispatch(
              FormConfigurationActions.updateFormMetadata({
                formMetadata: curr
              })
            );

            this.store.dispatch(
              FormConfigurationActions.updateForm({
                formMetadata: this.formMetaData
              })
            );
          }
        })
      )
      .subscribe();

    this.formConfiguration
      .get('counter')
      .valueChanges.pipe(
        // eslint-disable-next-line @typescript-eslint/no-shadow
        tap((counter) =>
          this.store.dispatch(
            FormConfigurationActions.updateCounter({
              counter
            })
          )
        )
      )
      .subscribe();

    this.formMetadata$ = this.store.select(getFormMetadata).pipe(
      tap((formMetadata) => {
        const { name, description, id } = formMetadata;
        this.formMetaData = formMetadata;
        this.formConfiguration.patchValue({ name, description, id });
      })
    );
    this.pageIndexes$ = this.store.select(getPageIndexes);
    this.sectionIndexes$ = this.store
      .select(getSectionIndexes)
      .pipe(tap((sectionIndexes) => (this.sectionIndexes = sectionIndexes)));
    this.sectionIds$ = this.store.select(getSectionIds);
    this.questionIndexes$ = this.store
      .select(getQuestionIndexes)
      .pipe(tap((questionIndexes) => (this.questionIndexes = questionIndexes)));

    this.store.dispatch(
      FormConfigurationActions.addPage({
        page: this.getPageObject(0, 0, 0),
        pageIndex: 0
      })
    );
    this.formDetails$ = this.store.select(getFormDetails);

    this.authoredFormDetail$ = this.store.select(getFormDetails).pipe(
      tap(
        ({ formStatus, formListId, counter, pages, authoredFormDetailId }) => {
          if (pages.length && formListId) {
            if (authoredFormDetailId) {
              this.store.dispatch(
                FormConfigurationActions.updateAuthoredFormDetail({
                  formStatus,
                  formListId,
                  counter,
                  pages,
                  authoredFormDetailId
                })
              );
            } else {
              this.store.dispatch(
                FormConfigurationActions.createAuthoredFormDetail({
                  formStatus,
                  formListId,
                  counter,
                  pages
                })
              );
            }
          }
        }
      )
    );
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
    return {
      name: 'Page',
      position: pageIndex + 1,
      sections: [section],
      questions: [this.getQuestion(questionIndex, section.id)]
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
      position: sectionIndex + 1
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
      isPublishedTillSave: false
    };
  }

  pageEventHandler(event: PageEvent) {
    const { pageIndex, type } = event;
    switch (type) {
      case 'add':
        this.store.dispatch(
          FormConfigurationActions.addPage({
            page: this.getPageObject(pageIndex, 0, 0),
            pageIndex
          })
        );
        break;

      case 'delete':
        this.store.dispatch(
          FormConfigurationActions.deletePage({
            pageIndex
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
          this.store.dispatch(
            FormConfigurationActions.addSection({
              section,
              question: this.getQuestion(0, section.id),
              pageIndex,
              sectionIndex
            })
          );
        }
        break;

      case 'update':
        this.store.dispatch(
          FormConfigurationActions.updateSection({
            section,
            sectionIndex,
            pageIndex
          })
        );
        break;

      case 'delete':
        this.store.dispatch(
          FormConfigurationActions.deleteSection({
            sectionIndex,
            sectionId: section.id,
            pageIndex
          })
        );
        break;
    }
  }

  questionEventHandler(event: QuestionEvent) {
    const { pageIndex, questionIndex, sectionId, question, type } = event;
    switch (type) {
      case 'add':
        this.store.dispatch(
          FormConfigurationActions.addQuestion({
            question: this.getQuestion(questionIndex, sectionId),
            pageIndex,
            sectionId,
            questionIndex
          })
        );
        break;

      case 'update':
        this.store.dispatch(
          FormConfigurationActions.updateQuestion({
            question,
            questionIndex,
            pageIndex
          })
        );
        break;

      case 'delete':
        this.store.dispatch(
          FormConfigurationActions.deleteQuestion({
            questionIndex,
            pageIndex
          })
        );
        break;
    }
  }

  uploadFormImageFile(e) {
    // uploaded image  file code
  }

  publishFormDetail() {
    this.formDetails$
      .pipe(
        tap((formDetails) => {
          const formConfig = this.formConfiguration.value;
          if (formDetails.formMetadata.formStatus === 'published') {
            this.raceDynamicFormService.updateFormDetail$(
              formConfig,
              formDetails.pages
            );
          } else
            this.raceDynamicFormService.createFormDetail$(
              formConfig,
              formDetails.pages
            );
        })
      )
      .subscribe();
  }

  toggleFieldContentOpenState() {
    this.fieldContentOpenState = true;
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
        FormConfigurationActions.updatePage({
          pageIndex,
          data: sectionPositionMap
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
            pageIndex
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
          pageIndex
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
      .subscribe((v) => (pageSections = v.sections));
    return pageSections;
  }

  ngOnDestroy(): void {
    this.store.dispatch(FormConfigurationActions.resetFormConfiguration());
  }
}
