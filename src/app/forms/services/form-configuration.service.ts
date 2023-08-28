import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { formConfigurationStatus } from 'src/app/app.constants';
import { BuilderConfigurationActions } from 'src/app/forms/state/actions';
import {
  NumberRangeMetadata,
  Question,
  Section,
  SectionQuestions
} from 'src/app/interfaces';
import { State } from '../state';
import { v4 as uuidv4 } from 'uuid';
import { CommonService } from 'src/app/shared/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class FormConfigurationService {
  private defField = {
    id: '',
    sectionId: '',
    name: '',
    fieldType: 'TF',
    position: 0,
    required: false,
    enableHistory: false,
    historyCount: 5,
    multi: false,
    value: 'TF',
    isPublished: false,
    isPublishedTillSave: false,
    isOpen: false,
    isResponseTypeModalOpen: false,
    unitOfMeasurement: 'None',
    rangeMetadata: {} as NumberRangeMetadata
  };
  constructor(
    private store: Store<State>,
    private readonly commonService: CommonService
  ) {}

  addPage(
    pageIndex: number,
    addSections: number,
    addQuestions: number,
    pageWiseSectionIndexes: any,
    questionCounter: number,
    sectionQuestionsList: SectionQuestions[] = []
  ) {
    const { counter, ...page } = this.getPageObject(
      pageIndex,
      addSections,
      addQuestions,
      pageWiseSectionIndexes,
      questionCounter,
      sectionQuestionsList
    );

    this.store.dispatch(
      BuilderConfigurationActions.addPage({
        page,
        pageIndex,
        ...this.getFormConfigurationStatuses(),
        subFormId: null,
        counter
      })
    );
    if (
      sectionQuestionsList.length === 0 ||
      !sectionQuestionsList[0].section?.isImported
    ) {
      this.store.dispatch(
        BuilderConfigurationActions.updateQuestionState({
          questionId: page.questions[addQuestions - 1].id,
          isOpen: true,
          isResponseTypeModalOpen: false,
          subFormId: null
        })
      );
    }
  }

  addSections(
    pageIndex: number,
    addSections: number,
    addQuestions: number,
    sectionIndex: number,
    pageWiseSectionIndexes: any,
    questionCounter: number,
    sectionQuestionsList: SectionQuestions[] = []
  ) {
    const { sections, questions, counter, logics } = this.getSectionsObject(
      pageIndex,
      addSections,
      addQuestions,
      pageWiseSectionIndexes,
      questionCounter,
      sectionQuestionsList
    );
    if (logics?.length)
      this.store.dispatch(
        BuilderConfigurationActions.addLogics({
          logics,
          pageIndex,
          ...this.getFormConfigurationStatuses(),
          subFormId: null
        })
      );
    this.store.dispatch(
      BuilderConfigurationActions.addSections({
        sections,
        questions,
        pageIndex,
        sectionIndex,
        ...this.getFormConfigurationStatuses(),
        subFormId: null,
        counter
      })
    );

    this.store.dispatch(
      BuilderConfigurationActions.updatePageState({
        pageIndex,
        isOpen: true,
        subFormId: null
      })
    );
    if (
      sectionQuestionsList.length === 0 ||
      !sectionQuestionsList[0].section?.isImported
    ) {
      this.store.dispatch(
        BuilderConfigurationActions.updateQuestionState({
          questionId: questions[addQuestions - 1].id,
          isOpen: true,
          isResponseTypeModalOpen: false,
          subFormId: null
        })
      );
    }
  }

  addQuestions(
    pageIndex: number,
    sectionId: string,
    addQuestions: number,
    questionIndex: number,
    questionCounter: number,
    questions: Question[] = []
  ) {
    let counter: number;
    const sectionQuestions = new Array(addQuestions).fill(0).map((q, index) => {
      counter = questionCounter + index + 1;
      return this.getQuestion(
        questionIndex + index,
        sectionId,
        questionCounter + index + 1,
        questions[index]
      );
    });
    this.store.dispatch(
      BuilderConfigurationActions.addQuestions({
        questions: sectionQuestions,
        pageIndex,
        sectionId,
        questionIndex,
        ...this.getFormConfigurationStatuses(),
        subFormId: null,
        counter
      })
    );
    this.store.dispatch(
      BuilderConfigurationActions.updateQuestionState({
        questionId: sectionQuestions[addQuestions - 1].id,
        isOpen: true,
        isResponseTypeModalOpen: false,
        subFormId: null
      })
    );
  }

  getDefQues() {
    return this.defField;
  }

  private getFormConfigurationStatuses() {
    return {
      formStatus: formConfigurationStatus.draft,
      formDetailPublishStatus: formConfigurationStatus.draft,
      formSaveStatus: formConfigurationStatus.saving
    };
  }

  private getPageObject(
    pageIndex: number,
    addSections: number,
    addQuestions: number,
    pageWiseSectionIndexes: any,
    questionCounter: number,
    sectionQuestionsList: SectionQuestions[]
  ) {
    const { sections, questions, counter, logics } = this.getSectionsObject(
      pageIndex,
      addSections,
      addQuestions,
      pageWiseSectionIndexes,
      questionCounter,
      sectionQuestionsList
    );

    return {
      name: 'Page',
      position: pageIndex + 1,
      isOpen: true,
      sections,
      questions,
      logics,
      counter
    };
  }

  private getSectionsObject(
    pageIndex: number,
    addSections: number,
    addQuestions: number,
    pageWiseSectionIndexes: any,
    questionCounter: number,
    sectionQuestionsList: SectionQuestions[]
  ) {
    let sectionCount =
      pageWiseSectionIndexes && pageWiseSectionIndexes[pageIndex]
        ? pageWiseSectionIndexes[pageIndex].length
        : 0;
    let sliceStart = 0;
    let questions: Question[] = [];
    let counter: number;
    let logics: any[] = [];

    const sections = new Array(addSections).fill(0).map((s, sectionIndex) => {
      sectionCount = ++sectionCount;
      const section = this.getSection(
        sectionCount,
        sectionQuestionsList[sectionIndex]?.section
      );
      const sectionQuestions = new Array(addQuestions)
        .fill(0)
        .slice(
          sliceStart,
          sliceStart +
            (sectionQuestionsList[sectionIndex]?.questions
              ? sectionQuestionsList[sectionIndex]?.questions?.length
              : addQuestions)
        )
        .map((q, questionIndex) => {
          counter = questionCounter + sliceStart + questionIndex + 1;
          return this.getQuestion(
            questionIndex,
            sectionQuestionsList[sectionIndex]?.questions[
              questionIndex
            ]?.sectionId?.startsWith('AQ') ||
              sectionQuestionsList[sectionIndex]?.questions[
                questionIndex
              ]?.sectionId?.startsWith('EVIDENCE')
              ? sectionQuestionsList[sectionIndex]?.questions[questionIndex]
                  ?.sectionId
              : section.id,
            counter,
            sectionQuestionsList[sectionIndex]?.questions[questionIndex]
          );
        });

      sliceStart += sectionQuestionsList[sectionIndex]?.questions?.length;
      questions = [...questions, ...sectionQuestions];
      logics = [
        ...logics,
        ...(sectionQuestionsList[sectionIndex]?.logics || [])
      ];

      return section;
    });

    return {
      sections,
      questions,
      counter,
      logics
    };
  }

  private getSection(sectionIndex: number, section: Section) {
    const templateData: any = {};
    if (section?.isImported === true) {
      templateData.isImported = section.isImported;
      templateData.externalSectionId = section.externalSectionId;
      templateData.templateId = section.templateId;
      templateData.templateName = section.templateName;
      templateData.counter = section.counter;
    }
    return {
      id: `S${uuidv4()}`,
      name: section ? section.name : 'Section',
      position: sectionIndex,
      isOpen: true,
      ...templateData
    };
  }

  private getQuestion(
    questionIndex: number,
    sectionId: string,
    questionCounter: number,
    question: Question
  ) {
    return {
      id:
        question?.id?.startsWith('TQ') || question?.id?.startsWith('AQ')
          ? question.id
          : `Q${uuidv4()}`,
      sectionId,
      name: question ? question.name : '',
      fieldType: question ? question.fieldType : 'TF',
      position: questionIndex + 1,
      required: question ? question.required : false,
      enableHistory: question ? question.enableHistory : false,
      historyCount: question ? question.historyCount : 5,
      multi: question ? question.multi : false,
      value: question ? question.value : 'TF',
      isPublished: false,
      isPublishedTillSave: false,
      isOpen: question ? false : true,
      isResponseTypeModalOpen: false,
      unitOfMeasurement: question ? question.unitOfMeasurement : 'None',
      rangeMetadata: question
        ? question.rangeMetadata
        : ({} as NumberRangeMetadata)
    };
  }
}
