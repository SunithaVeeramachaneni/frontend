import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { formConfigurationStatus } from 'src/app/app.constants';
import { FormConfigurationActions } from 'src/app/forms/state/actions';
import {
  NumberRangeMetadata,
  Question,
  Section,
  SectionQuestions
} from 'src/app/interfaces';
import { State } from 'src/app/state/app.state';

@Injectable({
  providedIn: 'root'
})
export class FormConfigurationService {
  constructor(private store: Store<State>) {}

  addPage(
    pageIndex: number,
    addSections: number,
    addQuestions: number,
    pageWiseSectionIndexes: any,
    questionCounter: number,
    sectionQuestionsList: SectionQuestions[] = []
  ) {
    const page = this.getPageObject(
      pageIndex,
      addSections,
      addQuestions,
      pageWiseSectionIndexes,
      questionCounter,
      sectionQuestionsList
    );

    this.store.dispatch(
      FormConfigurationActions.addPage({
        page,
        pageIndex,
        ...this.getFormConfigurationStatuses()
      })
    );

    this.store.dispatch(
      FormConfigurationActions.updateQuestionState({
        questionId: page.questions[addQuestions - 1].id,
        isOpen: true,
        isResponseTypeModalOpen: false
      })
    );
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
    const { sections, questions } = this.getSectionsObject(
      pageIndex,
      addSections,
      addQuestions,
      pageWiseSectionIndexes,
      questionCounter,
      sectionQuestionsList
    );
    this.store.dispatch(
      FormConfigurationActions.addSections({
        sections,
        questions,
        pageIndex,
        sectionIndex,
        ...this.getFormConfigurationStatuses()
      })
    );
    this.store.dispatch(
      FormConfigurationActions.updatePageState({
        pageIndex,
        isOpen: true
      })
    );
    this.store.dispatch(
      FormConfigurationActions.updateQuestionState({
        questionId: questions[addQuestions - 1].id,
        isOpen: true,
        isResponseTypeModalOpen: false
      })
    );
  }

  addQuestions(
    pageIndex: number,
    sectionId: string,
    addQuestions: number,
    questionIndex: number,
    questionCounter: number,
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
      FormConfigurationActions.addQuestions({
        questions: sectionQuestions,
        pageIndex,
        sectionId,
        questionIndex,
        ...this.getFormConfigurationStatuses()
      })
    );
    this.store.dispatch(
      FormConfigurationActions.updateQuestionState({
        questionId: sectionQuestions[addQuestions - 1].id,
        isOpen: true,
        isResponseTypeModalOpen: false
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
    sectionQuestionsList: SectionQuestions[]
  ) {
    const { sections, questions } = this.getSectionsObject(
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
      logics: []
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

  private getSection(sectionIndex: number, section: Section) {
    return {
      id: `S${sectionIndex}`,
      name: section ? section.name : 'Section',
      position: sectionIndex,
      isOpen: true
    };
  }

  private getQuestion(
    questionIndex: number,
    sectionId: string,
    questionCounter: number,
    question: Question
  ) {
    this.store.dispatch(
      FormConfigurationActions.updateCounter({ counter: questionCounter })
    );
    return {
      id: `Q${questionCounter}`,
      sectionId,
      name: question ? question.name : '',
      fieldType: question ? question.fieldType : 'TF',
      position: questionIndex + 1,
      required: question ? question.required : false,
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
