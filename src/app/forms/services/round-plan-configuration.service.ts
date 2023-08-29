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
import { State } from '../state/builder/builder-state.selectors';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class RoundPlanConfigurationService {
  constructor(private store: Store<State>) {}

  addPage(
    pageIndex: number,
    addSections: number,
    addQuestions: number,
    pageWiseSectionIndexes: any,
    questionCounter: number,
    subFormId: string,
    isEmbeddedForm: boolean,
    isTemplate: boolean,
    sectionQuestionsList: SectionQuestions[] = []
  ) {
    const { counter, ...page } = this.getPageObject(
      pageIndex,
      addSections,
      addQuestions,
      pageWiseSectionIndexes,
      questionCounter,
      sectionQuestionsList,
      isEmbeddedForm,
      isTemplate
    );
    this.store.dispatch(
      BuilderConfigurationActions.addPage({
        subFormId,
        page,
        pageIndex,
        ...this.getFormConfigurationStatuses(),
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
          subFormId
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
    subFormId: string,
    isEmbeddedForm: boolean,
    isTemplate: boolean,
    sectionQuestionsList: SectionQuestions[] = []
  ) {
    const { sections, questions, counter, logics } = this.getSectionsObject(
      pageIndex,
      addSections,
      addQuestions,
      pageWiseSectionIndexes,
      questionCounter,
      sectionQuestionsList,
      isEmbeddedForm,
      isTemplate
    );
    if (logics?.length) {
      this.store.dispatch(
        BuilderConfigurationActions.addLogics({
          logics,
          pageIndex,
          ...this.getFormConfigurationStatuses(),
          subFormId
        })
      );
    }
    this.store.dispatch(
      BuilderConfigurationActions.addSections({
        sections,
        questions,
        pageIndex,
        sectionIndex,
        ...this.getFormConfigurationStatuses(),
        subFormId,
        counter
      })
    );

    this.store.dispatch(
      BuilderConfigurationActions.updatePageState({
        pageIndex,
        isOpen: true,
        subFormId
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
          subFormId
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
    subFormId: string,
    isTemplate: boolean,
    questions: Question[] = []
  ) {
    let counter: number;
    const sectionQuestions = new Array(addQuestions).fill(0).map((q, index) => {
      counter = questionCounter + index + 1;
      return this.getQuestion(
        questionIndex + index,
        sectionId,
        questionCounter + index + 1,
        questions[index],
        isTemplate
      );
    });
    this.store.dispatch(
      BuilderConfigurationActions.addQuestions({
        questions: sectionQuestions,
        pageIndex,
        sectionId,
        questionIndex,
        ...this.getFormConfigurationStatuses(),
        subFormId,
        counter
      })
    );
    this.store.dispatch(
      BuilderConfigurationActions.updateQuestionState({
        questionId: sectionQuestions[addQuestions - 1].id,
        isOpen: true,
        isResponseTypeModalOpen: false,
        subFormId
      })
    );
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
    sectionQuestionsList: SectionQuestions[],
    isEmbeddedForm: boolean,
    isTemplate: boolean
  ) {
    const { sections, questions, counter } = this.getSectionsObject(
      pageIndex,
      addSections,
      addQuestions,
      pageWiseSectionIndexes,
      questionCounter,
      sectionQuestionsList,
      isEmbeddedForm,
      isTemplate
    );

    return {
      name: 'Page',
      position: pageIndex + 1,
      isOpen: true,
      sections,
      questions,
      logics: [],
      counter
    };
  }

  private getSectionsObject(
    pageIndex: number,
    addSections: number,
    addQuestions: number,
    pageWiseSectionIndexes: any,
    questionCounter: number,
    sectionQuestionsList: SectionQuestions[],
    isEmbeddedForm: boolean,
    isTemplate: boolean
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
        sectionQuestionsList[sectionIndex]?.section,
        isEmbeddedForm
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
            ]?.sectionId?.startsWith('AQ')
              ? sectionQuestionsList[sectionIndex]?.questions[questionIndex]
                  ?.sectionId
              : section.id,
            counter,
            sectionQuestionsList[sectionIndex]?.questions[questionIndex],
            isTemplate
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

  private getSection(
    sectionIndex: number,
    section: Section,
    isEmbeddedForm: boolean
  ) {
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
      name: section
        ? section.name
        : isEmbeddedForm
        ? `Section ${sectionIndex}`
        : `Section`,
      position: sectionIndex,
      isOpen: true,
      ...templateData
    };
  }

  private getQuestion(
    questionIndex: number,
    sectionId: string,
    questionCounter: number,
    question: Question,
    isTemplate: boolean
  ) {
    return {
      id: question?.skipIdGeneration
        ? question.id
        : isTemplate
        ? `TQ${questionCounter}_${new Date().getTime()}`
        : `Q${questionCounter}`,
      sectionId,
      name: question ? question.name : '',
      fieldType: question ? question.fieldType : 'TF',
      position: questionIndex + 1,
      required: question ? question.required : false,
      enableHistory: question ? question.enableHistory : false,
      multi: question ? question.multi : false,
      value: question ? question.value : 'TF',
      isPublished: false,
      isPublishedTillSave: false,
      isOpen: question ? false : true,
      isResponseTypeModalOpen: false,
      unitOfMeasurement: question ? question.unitOfMeasurement : 'None',
      rangeMetadata: question
        ? question.rangeMetadata
        : ({} as NumberRangeMetadata),
      additionalDetails: question?.additionalDetails
        ? question.additionalDetails
        : { tags: [], attributes: [] }
    };
  }
}
