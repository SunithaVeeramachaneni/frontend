import { createReducer, on } from '@ngrx/store';
import { FormMetadata, Page } from 'src/app/interfaces';
import { FormConfigurationActions } from './actions';

export interface FormConfigurationState {
  formMetadata: FormMetadata;
  pages: Page[];
  counter: number;
  formStatus: string;
}

const initialState = {
  formMetadata: {} as FormMetadata,
  pages: [] as Page[],
  counter: 0,
  formStatus: 'draft'
};

export const formConfigurationReducer = createReducer<FormConfigurationState>(
  initialState,
  on(
    FormConfigurationActions.addFormMetadata,
    (state, action): FormConfigurationState => ({
      ...state,
      formMetadata: { ...action.formMetadata }
    })
  ),
  on(
    FormConfigurationActions.updateFormMetadata,
    (state, action): FormConfigurationState => {
      const { counter, formStatus, ...formMetadata } = action.formMetadata;
      return {
        ...state,
        formMetadata: {
          ...state.formMetadata,
          ...formMetadata,
          formStatus:
            state.formStatus === 'published' ? state.formStatus : formStatus
        },
        counter,
        formStatus
      };
    }
  ),
  on(
    FormConfigurationActions.addPage,
    (state, action): FormConfigurationState => ({
      ...state,
      pages: [
        ...state.pages.slice(0, action.pageIndex),
        action.page,
        ...state.pages
          .slice(action.pageIndex)
          .map((page) => ({ ...page, position: page.position + 1 }))
      ]
    })
  ),
  on(
    FormConfigurationActions.deletePage,
    (state, action): FormConfigurationState => ({
      ...state,
      pages: [
        ...state.pages.slice(0, action.pageIndex),
        ...state.pages
          .slice(action.pageIndex + 1)
          .map((page) => ({ ...page, position: page.position - 1 }))
      ]
    })
  ),
  on(
    FormConfigurationActions.addSection,
    (state, action): FormConfigurationState => {
      const pages = state.pages.map((page, pageIndex) => {
        if (pageIndex === action.pageIndex) {
          const sections = [
            ...page.sections.slice(0, action.sectionIndex),
            action.section,
            ...page.sections.slice(action.sectionIndex).map((section) => ({
              ...section,
              position: section.position + 1
            }))
          ];
          return {
            ...page,
            sections,
            questions: [...page.questions, action.question]
          };
        }
        return page;
      });
      return {
        ...state,
        pages
      };
    }
  ),
  on(
    FormConfigurationActions.updateSection,
    (state, action): FormConfigurationState => {
      const pages = state.pages.map((page, pageIndex) => {
        if (pageIndex === action.pageIndex) {
          const sections = [
            ...page.sections.slice(0, action.sectionIndex),
            action.section,
            ...page.sections.slice(action.sectionIndex + 1)
          ];
          return {
            ...page,
            sections
          };
        }
        return page;
      });
      return {
        ...state,
        pages
      };
    }
  ),
  on(
    FormConfigurationActions.deleteSection,
    (state, action): FormConfigurationState => {
      const pages = state.pages.map((page, pageIndex) => {
        if (pageIndex === action.pageIndex) {
          const sections = [
            ...page.sections.slice(0, action.sectionIndex),
            ...page.sections.slice(action.sectionIndex + 1).map((section) => ({
              ...section,
              position: section.position - 1
            }))
          ];
          const questions = page.questions.filter(
            (question) => question.sectionId !== action.sectionId
          );
          return {
            ...page,
            sections,
            questions
          };
        }
        return page;
      });
      return {
        ...state,
        pages
      };
    }
  ),
  on(
    FormConfigurationActions.addQuestion,
    (state, action): FormConfigurationState => {
      const pages = state.pages.map((page, pageIndex) => {
        if (pageIndex === action.pageIndex) {
          let sectionQuestions = page.questions.filter(
            (question) => question.sectionId === action.sectionId
          );
          const remainingQuestions = page.questions.filter(
            (question) => question.sectionId !== action.sectionId
          );
          sectionQuestions = [
            ...sectionQuestions.slice(0, action.questionIndex),
            action.question,
            ...sectionQuestions.slice(action.questionIndex).map((question) => ({
              ...question,
              position: question.position + 1
            }))
          ];
          return {
            ...page,
            questions: [...sectionQuestions, ...remainingQuestions]
          };
        }
        return page;
      });
      return {
        ...state,
        pages
      };
    }
  ),
  on(
    FormConfigurationActions.updateQuestion,
    (state, action): FormConfigurationState => {
      const pages = state.pages.map((page, pageIndex) => {
        if (pageIndex === action.pageIndex) {
          const questions = [
            ...page.questions.slice(0, action.questionIndex),
            action.question,
            ...page.questions.slice(action.questionIndex + 1)
          ];
          return {
            ...page,
            questions
          };
        }
        return page;
      });
      return {
        ...state,
        pages
      };
    }
  ),
  on(
    FormConfigurationActions.deleteQuestion,
    (state, action): FormConfigurationState => {
      const pages = state.pages.map((page, pageIndex) => {
        if (pageIndex === action.pageIndex) {
          const questions = [
            ...page.questions.slice(0, action.questionIndex),
            ...page.questions
              .slice(action.questionIndex + 1)
              .map((question) => ({
                ...question,
                position: question.position - 1
              }))
          ];
          return {
            ...page,
            questions
          };
        }
        return page;
      });
      return {
        ...state,
        pages
      };
    }
  ),
  on(
    FormConfigurationActions.resetFormConfiguration,
    (state): FormConfigurationState => ({
      ...state,
      ...initialState
    })
  )
);
