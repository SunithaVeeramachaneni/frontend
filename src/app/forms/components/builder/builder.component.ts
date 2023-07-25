/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy
} from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  PageEvent,
  QuestionEvent,
  SectionEvent,
  Question,
  Section,
  FormMetadata,
  Page,
  SectionQuestions
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
  getPageWiseQuestionLogics,
  getImportedSectionsByTemplateId
} from 'src/app/forms/state/builder/builder-state.selectors';

import { BuilderConfigurationActions } from 'src/app/forms/state/actions';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { formConfigurationStatus } from 'src/app/app.constants';
import { RoundPlanConfigurationService } from 'src/app/forms/services/round-plan-configuration.service';
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuilderComponent implements OnInit, OnDestroy {
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
  @Input() isTemplate;
  @Input() formId;

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
  pageWiseSectionQuestions: any;
  questionCounter: any;
  importedSectionsByTemplateId: any = {};
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
  importedSectionsByTemplateId$: Observable<any>;
  updateFormTemplateUsageByFormIdSubscription: Subscription;

  readonly formConfigurationStatus = formConfigurationStatus;

  private _selectedNode: any;

  constructor(
    private store: Store<State>,
    private roundPlanConfigurationService: RoundPlanConfigurationService,
    private raceDynamicFormService: RaceDynamicFormService
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
    this.questionCounter$ = this.store
      .select(getQuestionCounter)
      .pipe(tap((questionCounter) => (this.questionCounter = questionCounter)));
    this.pageWiseSectionQuestions$ = this.store
      .select(getPageWiseSectionQuestions(this.selectedNode.id))
      .pipe(
        tap(
          (pageWiseSectionQuestions) =>
            (this.pageWiseSectionQuestions = pageWiseSectionQuestions)
        )
      );
    this.pageWiseSections$ = this.store
      .select(getPageWiseSections(this.selectedNode.id))
      .pipe(
        tap((pageWiseSections) => (this.pageWiseSections = pageWiseSections))
      );
    this.pageWiseQuestionLogics$ = this.store.select(
      getPageWiseQuestionLogics(this.selectedNode.id)
    );
    this.importedSectionsByTemplateId$ = this.store
      .select(getImportedSectionsByTemplateId(this.selectedNode.id))
      .pipe(
        tap((importedSectionsByTemplateId) => {
          this.importedSectionsByTemplateId = importedSectionsByTemplateId;
        })
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
      this.isEmbeddedForm,
      this.isTemplate
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
            this.isEmbeddedForm,
            this.isTemplate
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
        const templateIds = [];
        for (const section of this.pageWiseSections[pageIndex]) {
          if (section.isImported) templateIds.push(section.templateId);
        }
        this.isEmptyPage[pageIndex] = false;
        this.store.dispatch(
          BuilderConfigurationActions.deletePage({
            pageIndex,
            ...this.getFormConfigurationStatuses(),
            subFormId: this.selectedNode.id
          })
        );
        this.updateFormTemplateUsageByFormId(templateIds);
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
            this.isEmbeddedForm,
            this.isTemplate
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

        if (section.isImported)
          this.updateFormTemplateUsageByFormId([section.templateId]);

        this.isEmptyPage[pageIndex] =
          this.pageWiseSections[pageIndex].length === 0;
        break;

      case 'copy':
        this.copySection(pageIndex, sectionIndex, section);
        break;
      case 'unlink':
        const templateId = section.templateId;
        delete section.isImported;
        delete section.templateId;
        delete section.templateName;
        delete section.externalSectionId;
        delete section.counter;
        this.store.dispatch(
          BuilderConfigurationActions.updateSection({
            section,
            sectionIndex,
            pageIndex,
            ...this.getFormConfigurationStatuses(),
            subFormId: this.selectedNode.id
          })
        );
        this.updateFormTemplateUsageByFormId([templateId]);
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
            this.selectedNode.id,
            this.isTemplate
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

  copySection(pageIndex, sectionIndex, section: Section) {
    const sectionQuestionsList: SectionQuestions[] = [];
    const questionsArray =
      this.pageWiseSectionQuestions[pageIndex][section.id]?.questions || [];
    const logicsArray = [];
    delete section.isImported;
    delete section.templateId;
    delete section.externalSectionId;
    delete section.counter;
    delete section.id;
    sectionQuestionsList.push({
      section,
      questions: questionsArray
    });

    this.roundPlanConfigurationService.addSections(
      pageIndex,
      1,
      sectionQuestionsList[0].questions.length,
      sectionIndex + 1,
      this.sectionIndexes,
      this.questionCounter,
      this.selectedNode.id,
      this.isEmbeddedForm,
      this.isTemplate,
      sectionQuestionsList
    );
  }

  updateFormTemplateUsageByFormId(templateIds) {
    const importedSections = {};
    for (const templateId of templateIds) {
      importedSections[templateId] =
        this.importedSectionsByTemplateId[templateId] || {};
    }
    this.raceDynamicFormService
      .updateFormTemplateUsageByFormId$({
        formId: this.formId,
        importedSections
      })
      .subscribe();
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
        this.counter,
        subFormId,
        this.isTemplate
      );
    }
  }

  addSection(pageIndex) {
    this.isEmptyPage[pageIndex] = false;
    this.sectionEventHandler({ pageIndex, type: 'add', sectionIndex: 0 });
  }

  ngOnDestroy() {
    if (this.updateFormTemplateUsageByFormIdSubscription) {
      this.updateFormTemplateUsageByFormIdSubscription.unsubscribe();
    }
  }
}
