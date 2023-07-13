/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  PageEvent,
  QuestionEvent,
  SectionEvent,
  Question,
  Section,
  FormMetadata,
  Page
} from 'src/app/interfaces';

import {
  getPageIndexes,
  getQuestionIndexes,
  getSectionIds,
  getSectionIndexes,
  getQuestionIds,
  State,
  getSubFormPages,
  getQuestionCounter,
  getPageWiseSectionQuestions,
  getPageWiseSections,
  getPageWiseQuestionLogics
} from 'src/app/forms/state/builder/builder-state.selectors';

import { BuilderConfigurationActions } from 'src/app/forms/state/actions';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { formConfigurationStatus } from 'src/app/app.constants';
import { RoundPlanConfigurationService } from 'src/app/forms/services/round-plan-configuration.service';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuilderComponent implements OnInit {
  @Input() set selectedNode(node: any) {
    this._selectedNode = node ? node : ({} as any);
    if (Object.keys(node).length) {
      this.initSubscriptions();
    }
  }
  get selectedNode(): any {
    return this._selectedNode;
  }
  @Input() counter;
  @Input() isPreviewActive;
  @Input() moduleName;
  @Input() isEmbeddedForm;

  subFormPages$: Observable<any>;
  pageIndexes$: Observable<number[]>;
  sectionIndexes$: Observable<any>;
  sectionIndexes: any;
  sectionIds$: Observable<any>;
  questionIds$: Observable<any>;
  questionIndexes$: Observable<any>;
  questionIndexes: any;
  isEmptyPage: any = [];
  isEmptyPlan = true;
  pageWiseSections: any;
  questionCounter$: Observable<number>;
  formMetadata$: Observable<FormMetadata>;
  pageWiseSectionQuestions$: Observable<{
    [key: number]: {
      page: Page;
      pageQuestionsCount: number;
    } & {
      [key: string]: {
        section: Section;
        questions: Question[];
        questionsById: { [key: string]: Question };
      };
    };
  }>;
  pageWiseSections$: Observable<any>;
  pageWiseQuestionLogics$: Observable<any>;

  readonly formConfigurationStatus = formConfigurationStatus;

  private _selectedNode: any;

  constructor(
    private store: Store<State>,
    private roundPlanConfigurationService: RoundPlanConfigurationService
  ) {}

  initSubscriptions() {
    this.subFormPages$ = this.store
      .select(getSubFormPages(this.selectedNode.id))
      .pipe(
        tap((pages) => {
          if (pages && pages.length === 0) {
            this.isEmptyPlan = true;
          } else {
            this.isEmptyPlan = false;
          }
        })
      );
    this.pageIndexes$ = this.store.select(getPageIndexes(this.selectedNode.id));
    this.sectionIndexes$ = this.store
      .select(getSectionIndexes(this.selectedNode.id))
      .pipe(
        tap((sectionIndexes) => {
          this.sectionIndexes = sectionIndexes;
          for (const index in sectionIndexes) {
            if (Object.prototype.hasOwnProperty.call(sectionIndexes, index)) {
              const empty = sectionIndexes[index].length === 0;
              this.isEmptyPage.push(empty);
            }
          }
        })
      );
    this.sectionIds$ = this.store.select(getSectionIds(this.selectedNode.id));
    this.questionIds$ = this.store.select(getQuestionIds(this.selectedNode.id));
    this.questionIndexes$ = this.store
      .select(getQuestionIndexes(this.selectedNode.id))
      .pipe(tap((questionIndexes) => (this.questionIndexes = questionIndexes)));
    this.questionCounter$ = this.store.select(getQuestionCounter);
    this.pageWiseSectionQuestions$ = this.store.select(
      getPageWiseSectionQuestions(this.selectedNode.id)
    );
    this.pageWiseSections$ = this.store
      .select(getPageWiseSections(this.selectedNode.id))
      .pipe(
        tap((pageWiseSections) => (this.pageWiseSections = pageWiseSections))
      );
    this.pageWiseQuestionLogics$ = this.store.select(
      getPageWiseQuestionLogics(this.selectedNode.id)
    );
  }

  ngOnInit(): void {}

  addPage() {
    this.isEmptyPlan = false;
    this.roundPlanConfigurationService.addPage(
      0,
      1,
      1,
      this.sectionIndexes,
      this.counter,
      this.selectedNode.id,
      this.isEmbeddedForm
    );
  }

  pageEventHandler(event: PageEvent) {
    const { pageIndex, type, page } = event;
    switch (type) {
      case 'add':
        {
          this.roundPlanConfigurationService.addPage(
            pageIndex,
            1,
            1,
            this.sectionIndexes,
            this.counter,
            this.selectedNode.id,
            this.isEmbeddedForm
          );
        }
        break;
      case 'update':
        this.store.dispatch(
          BuilderConfigurationActions.updatePage({
            page,
            pageIndex,
            ...this.getFormConfigurationStatuses(),
            subFormId: this.selectedNode.id
          })
        );
        break;
      case 'delete':
        this.isEmptyPage[pageIndex] = false;
        this.store.dispatch(
          BuilderConfigurationActions.deletePage({
            pageIndex,
            ...this.getFormConfigurationStatuses(),
            subFormId: this.selectedNode.id
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
          this.roundPlanConfigurationService.addSections(
            pageIndex,
            1,
            1,
            sectionIndex,
            this.sectionIndexes,
            this.counter,
            this.selectedNode.id,
            this.isEmbeddedForm
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
            subFormId: this.selectedNode.id
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
            subFormId: this.selectedNode.id
          })
        );

        this.isEmptyPage[pageIndex] =
          this.pageWiseSections[pageIndex].length === 0;
        break;
    }
  }

  questionEventHandler(event: QuestionEvent) {
    const { pageIndex, questionIndex, sectionId, question, type } = event;
    switch (type) {
      case 'add':
        {
          this.roundPlanConfigurationService.addQuestions(
            pageIndex,
            sectionId,
            1,
            questionIndex,
            this.counter,
            this.selectedNode.id
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
            subFormId: this.selectedNode.id
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
            subFormId: this.selectedNode.id
          })
        );
        break;
    }
  }

  dropSection(event: CdkDragDrop<any>, pageIndex: number, subFormId: string) {
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
          subFormId
        })
      );
    }
  }

  drop(event: CdkDragDrop<any>, pageIndex, sectionId, subFormId: string) {
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
            subFormId
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
          subFormId
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

  addQuestion(pageIndex, sectionIndex, questionIndex, subFormId) {
    if (!this.isEmptyPage[pageIndex]) {
      this.roundPlanConfigurationService.addQuestions(
        pageIndex,
        sectionIndex,
        1,
        questionIndex,
        1,
        subFormId
      );
    }
  }

  addSection(pageIndex) {
    this.isEmptyPage[pageIndex] = false;
    this.sectionEventHandler({ pageIndex, type: 'add', sectionIndex: 0 });
  }
}
