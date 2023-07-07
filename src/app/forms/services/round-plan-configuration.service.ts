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
    sectionQuestionsList: SectionQuestions[] = []
  ) {
    const page = this.getPageObject(
      pageIndex,
      addSections,
      addQuestions,
      pageWiseSectionIndexes,
      questionCounter,
      sectionQuestionsList,
      isEmbeddedForm
    );
    this.store.dispatch(
      BuilderConfigurationActions.addPage({
        subFormId,
        page,
        pageIndex,
        ...this.getFormConfigurationStatuses()
      })
    );
    if (
      sectionQuestionsList.length &&
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
    sectionQuestionsList: SectionQuestions[] = []
  ) {
    const { sections, questions } = this.getSectionsObject(
      pageIndex,
      addSections,
      addQuestions,
      pageWiseSectionIndexes,
      questionCounter,
      sectionQuestionsList,
      isEmbeddedForm
    );
    this.store.dispatch(
      BuilderConfigurationActions.addSections({
        sections,
        questions,
        pageIndex,
        sectionIndex,
        ...this.getFormConfigurationStatuses(),
        subFormId
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
      sectionQuestionsList.length &&
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
    questions: Question[] = []
  ) {
    const sectionQuestions = new Array(addQuestions)
      .fill(0)
      .map((q, index) =>
        this.getQuestion(
          questionIndex + index,
          sectionId,
          questionCounter + index + 1,
          questions[index]
        )
      );
    this.store.dispatch(
      BuilderConfigurationActions.addQuestions({
        questions: sectionQuestions,
        pageIndex,
        sectionId,
        questionIndex,
        ...this.getFormConfigurationStatuses(),
        subFormId
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
    isEmbeddedForm: boolean
  ) {
    const { sections, questions } = this.getSectionsObject(
      pageIndex,
      addSections,
      addQuestions,
      pageWiseSectionIndexes,
      questionCounter,
      sectionQuestionsList,
      isEmbeddedForm
    );

    return {
      name: 'Page',
      position: pageIndex + 1,
      isOpen: true,
      sections,
      questions,
      logics: []
    };
  }

  private getSectionsObject(
    pageIndex: number,
    addSections: number,
    addQuestions: number,
    pageWiseSectionIndexes: any,
    questionCounter: number,
    sectionQuestionsList: SectionQuestions[],
    isEmbeddedForm: boolean
  ) {
    let sectionCount =
      pageWiseSectionIndexes && pageWiseSectionIndexes[pageIndex]
        ? pageWiseSectionIndexes[pageIndex].length
        : 0;
    let sliceStart = 0;
    let questions: Question[] = [];

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
              : 1)
        )
        .map((q, questionIndex) =>
          this.getQuestion(
            questionIndex,
            section.id,
            questionCounter + sliceStart + questionIndex + 1,
            sectionQuestionsList[sectionIndex]?.questions[questionIndex]
          )
        );

      sliceStart += sectionQuestionsList[sectionIndex]?.questions?.length;
      questions = [...questions, ...sectionQuestions];

      return section;
    });

    return {
      sections,
      questions
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
      templateData.externalSectionID = section.externalSectionID;
      templateData.templateID = section.templateID;
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
    question: Question
  ) {
    this.store.dispatch(
      BuilderConfigurationActions.updateCounter({ counter: questionCounter })
    );
    return {
      id: `Q${questionCounter}`,
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
        : ({} as NumberRangeMetadata)
    };
  }
}
