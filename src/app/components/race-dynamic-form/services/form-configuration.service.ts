import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { formConfigurationStatus } from 'src/app/app.constants';
import { FormConfigurationActions } from 'src/app/forms/state/actions';
import { Question, Section } from 'src/app/interfaces';
import { State } from 'src/app/state/app.state';

@Injectable({
  providedIn: 'root'
})
export class FormConfigurationService {
  constructor(private store: Store<State>) {}

  addPage(
    pageIndex: number,
    sectionIndex: number,
    questionIndexs: number[],
    sectionIndexes: any,
    questionCounter: number,
    questions: Question[] = []
  ) {
    const page = this.getPageObject(
      pageIndex,
      sectionIndex,
      questionIndexs,
      sectionIndexes,
      questionCounter,
      questions
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
        questionId: page.questions[questionIndexs.length - 1].id,
        isOpen: page.questions.length === 1 ? true : false,
        isResponseTypeModalOpen: false
      })
    );
  }

  addSection(
    pageIndex: number,
    sectionIndex: number,
    questionIndexs: number[],
    sectionIndexes: any,
    questionCounter: number,
    questions: Question[] = []
  ) {
    const { section, sectionQuestions } = this.getSectionObject(
      pageIndex,
      sectionIndex,
      questionIndexs,
      sectionIndexes,
      questionCounter,
      questions
    );
    this.store.dispatch(
      FormConfigurationActions.addSection({
        section,
        questions: sectionQuestions,
        pageIndex,
        sectionIndex,
        ...this.getFormConfigurationStatuses()
      })
    );
    this.store.dispatch(
      FormConfigurationActions.updateQuestionState({
        questionId: sectionQuestions[questionIndexs.length - 1].id,
        isOpen: sectionQuestions.length === 1 ? true : false,
        isResponseTypeModalOpen: false
      })
    );
  }

  addQuestions(
    pageIndex: number,
    sectionId: string,
    questionIndexs: number[],
    questionCounter: number,
    questions: Question[] = []
  ) {
    const sectionQuestions = questionIndexs.map((questionIndex, index) =>
      this.getQuestion(
        questionIndex,
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
        questionIndex: questionIndexs[0],
        ...this.getFormConfigurationStatuses()
      })
    );
    this.store.dispatch(
      FormConfigurationActions.updateQuestionState({
        questionId: sectionQuestions[questionIndexs.length - 1].id,
        isOpen: sectionQuestions.length === 1 ? true : false,
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
    sectionIndex: number,
    questionIndexs: number[],
    sectionIndexes: any,
    questionCounter: number,
    questions: Question[]
  ) {
    const section = this.getSection(pageIndex, sectionIndex, sectionIndexes);
    const sectionQuestions = questionIndexs.map((questionIndex, index) =>
      this.getQuestion(
        questionIndex,
        section.id,
        questionCounter + index + 1,
        questions[index]
      )
    );
    return {
      name: 'Page',
      position: pageIndex + 1,
      isOpen: true,
      sections: [section],
      questions: sectionQuestions,
      logics: []
    };
  }

  private getSectionObject(
    pageIndex: number,
    sectionIndex: number,
    questionIndexs: number[],
    sectionIndexes: any,
    questionCounter: number,
    questions: Question[]
  ) {
    const section = this.getSection(pageIndex, sectionIndex, sectionIndexes);
    const sectionQuestions = questionIndexs.map((questionIndex, index) =>
      this.getQuestion(
        questionIndex,
        section.id,
        questionCounter + index + 1,
        questions[index]
      )
    );
    return {
      section,
      sectionQuestions
    };
  }

  private getSection(pageIndex: number, sectionIndex: number, sectionIndexes) {
    return {
      id: `S${
        sectionIndexes && sectionIndexes[pageIndex]
          ? sectionIndexes[pageIndex].length + 1
          : 1
      }`,
      name: 'Section',
      position: sectionIndex + 1,
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
      isResponseTypeModalOpen: false
    };
  }
}
