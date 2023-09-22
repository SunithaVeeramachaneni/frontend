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
  getImportedSectionsByTemplateId,
  getFormConfigurationCounter
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
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash-es';
import { CommonService } from 'src/app/shared/services/common.service';

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

  @Input() mode;
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
  subFormPages: any;
  questionCounter: any;
  importedSectionsByTemplateId: any = {};
  formConfigurationCounter: any;
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
  getFormConfigurationCounter$: Observable<any>;
  updateFormTemplateUsageByFormIdSubscription: Subscription;
  get tagDetailType() {
    return this._tagDetailType;
  }
  set tagDetailType(type) {
    this._tagDetailType = type;
  }

  get attributeDetailType() {
    return this._attributeDetailType;
  }
  set attributeDetailType(type) {
    this._attributeDetailType = type;
  }

  readonly formConfigurationStatus = formConfigurationStatus;

  private _attributeDetailType = '';
  private _tagDetailType = '';
  private _selectedNode: any;

  constructor(
    private store: Store<State>,
    private roundPlanConfigurationService: RoundPlanConfigurationService,
    private raceDynamicFormService: RaceDynamicFormService,
    private readonly commonService: CommonService
  ) {}

  initSubscriptions() {
    this.subFormPages$ = this.store
      .select(getSubFormPages(this.selectedNode.id))
      .pipe(
        tap((pages) => {
          this.subFormPages = pages;
          if ((pages && pages.length === 0) || pages === undefined) {
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
    this.getFormConfigurationCounter$ = this.store
      .select(getFormConfigurationCounter())
      .pipe(
        tap((formConfigurationCounter) => {
          this.formConfigurationCounter = formConfigurationCounter;
        })
      );
  }

  ngOnInit(): void {
    this.setTagType();
  }

  setTagType() {
    if (this.moduleName === 'forms') {
      if (this.isTemplate) {
        this.attributeDetailType = 'formTemplates';
        this.tagDetailType = 'formTemplateDetailTags';
      } else {
        this.attributeDetailType = 'forms';
        this.tagDetailType = 'formDetailTags';
      }
    } else if (this.moduleName === 'rounds') {
      if (this.isTemplate) {
        this.attributeDetailType = 'roundTemplates';
        this.tagDetailType = 'roundTemplateDetailTags';
      } else {
        this.attributeDetailType = 'rounds';
        this.tagDetailType = 'roundDetailTags';
      }
    }
  }

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
        let hasImportedSections = false;
        for (const section of this.pageWiseSections[pageIndex]) {
          if (section.isImported) hasImportedSections = true;
        }
        if (hasImportedSections) {
          const formTemplateUsage = this.getFormTemplateUsage(pageIndex, -1);
          this.raceDynamicFormService
            .updateFormTemplateUsageByFormId$({
              formId: this.formId,
              importedSections: formTemplateUsage
            })
            .subscribe(() => {
              this.store.dispatch(
                BuilderConfigurationActions.deletePage({
                  pageIndex,
                  ...this.getFormConfigurationStatuses(),
                  subFormId: this.selectedNode.id
                })
              );
            });
        } else {
          this.store.dispatch(
            BuilderConfigurationActions.deletePage({
              pageIndex,
              ...this.getFormConfigurationStatuses(),
              subFormId: this.selectedNode.id
            })
          );
        }
        this.isEmptyPage[pageIndex] = false;

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
        if (section.isImported) {
          const formTemplateUsage = this.getFormTemplateUsage(
            pageIndex,
            sectionIndex
          );
          this.raceDynamicFormService
            .updateFormTemplateUsageByFormId$({
              formId: this.formId,
              importedSections: formTemplateUsage
            })
            .subscribe(() => {
              this.store.dispatch(
                BuilderConfigurationActions.deleteSection({
                  sectionIndex,
                  sectionId: section.id,
                  pageIndex,
                  ...this.getFormConfigurationStatuses(),
                  subFormId: this.selectedNode.id
                })
              );
            });
        } else {
          this.store.dispatch(
            BuilderConfigurationActions.deleteSection({
              sectionIndex,
              sectionId: section.id,
              pageIndex,
              ...this.getFormConfigurationStatuses(),
              subFormId: this.selectedNode.id
            })
          );
        }

        this.isEmptyPage[pageIndex] =
          this.pageWiseSections[pageIndex].length === 0;
        break;

      case 'copy':
        this.copySection(pageIndex, sectionIndex, section);
        break;
      case 'unlink':
        if (section.isImported) {
          const formTemplateUsage = this.getFormTemplateUsage(
            pageIndex,
            sectionIndex
          );
          this.raceDynamicFormService
            .updateFormTemplateUsageByFormId$({
              formId: this.formId,
              importedSections: formTemplateUsage
            })
            .subscribe(() => {
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
            });
        } else {
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
        }
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

  getFormTemplateUsage(pageIndex: number, sectionIndex: number) {
    /*
    if pageIndex is -1 it gives usage count for all pages
    if pageIndex is given and sectionIndex is -1, it ignores that pageIndex [deletePage]
    if pageIndex and sectionIndex is given, it ignores that setion from page [delete, unlink section]
    */
    const pages = this.subFormPages;
    const importedSections = {};
    // if some template section is delete we still have to send empty object so backend will handle and delete that entry from formtemplateusage
    if (pageIndex !== -1) {
      if (sectionIndex !== -1) {
        const section = this.pageWiseSections[pageIndex][sectionIndex];
        if (section.isImported) importedSections[section.templateId] = {};
      } else {
        const sections = this.pageWiseSections[pageIndex];
        for (const section of sections) {
          if (section.isImported) {
            importedSections[section.templateId] = {};
          }
        }
      }
    }
    for (let i = 0; i < pages.length; i++) {
      if (pageIndex === -1 || !(i === pageIndex && sectionIndex === -1)) {
        for (let j = 0; j < pages[i].sections.length; j++) {
          if (pageIndex === -1 || !(i === pageIndex && j === sectionIndex)) {
            const section = pages[i].sections[j];
            if (section.isImported) {
              if (!importedSections[section.templateId])
                importedSections[section.templateId] = {};
              importedSections[section.templateId][
                section.externalSectionId
              ] = 1;
            }
          }
        }
      }
    }
    return importedSections;
  }

  copySection(pageIndex, sectionIndex, section: Section) {
    const page = cloneDeep(this.subFormPages[pageIndex]);
    const sectionQuestionsList: SectionQuestions[] = [];
    const questionsArray = [];
    const sectionQuestions = {};
    const newQuestionIds = {};
    for (const question of page.questions || []) {
      if (question.sectionId === section.id) {
        newQuestionIds[question.id] = `Q${uuidv4()}`;
        sectionQuestions[question.id] = 1;
        question.id = newQuestionIds[question.id];
        question.skipIdGeneration = true;
        questionsArray.push(question);
      }
    }
    const logicsArray = [];
    const sectionLogics = {};
    const newLogicIds = {};
    const newAskEvidenceIds = {};
    for (const logic of page.logics || []) {
      if (sectionQuestions[logic.questionId]) {
        newLogicIds[logic.id] = uuidv4();
        sectionLogics[`AQ_${logic.id}`] = 1;
        sectionLogics[`EVIDENCE_${logic.id}`] = 1;
        logic.id = newLogicIds[logic.id];
        logic.questionId = newQuestionIds[logic.questionId];
        const prevAskEvidenceId = logic.askEvidence;
        logic.askEvidence = logic.questionId + '_0_EVIDENCE';
        newAskEvidenceIds[prevAskEvidenceId] = logic.askEvidence;
        logic.evidenceQuestions = logic.evidenceQuestions.map(
          (item) => newQuestionIds[item] || item
        );
        logic.hideQuestions = logic.hideQuestions.map(
          (item) => newQuestionIds[item] || item
        );
        logic.mandateQuestions = logic.mandateQuestions.map(
          (item) => newQuestionIds[item] || item
        );
        delete logic.questions;
        logicsArray.push(logic);
      }
    }
    const askQuestions = [];
    const askEvidences = [];
    for (const question of page.questions || []) {
      if (sectionLogics[question.sectionId]) {
        if (question.sectionId.startsWith('AQ_')) {
          question.id = `AQ_${uuidv4()}`;
          question.sectionId = `AQ_${
            newLogicIds[question.sectionId.substring(3)]
          }`;
          question.skipIdGeneration = true;
          askQuestions.push(question);
        } else if (question.sectionId.startsWith('EVIDENCE_')) {
          question.id = newAskEvidenceIds[question.id];
          question.sectionId = `EVIDENCE_${
            newLogicIds[question.sectionId.substring(9)]
          }`;
          question.skipIdGeneration = true;
          askEvidences.push(question);
        }
      }
    }
    delete section.isImported;
    delete section.templateId;
    delete section.externalSectionId;
    delete section.counter;
    delete section.id;
    sectionQuestionsList.push({
      section,
      questions: [...questionsArray, ...askQuestions, ...askEvidences],
      logics: logicsArray
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
