import { createReducer, on } from '@ngrx/store';
import { FormMetadata, Page } from 'src/app/interfaces';
import {
  FormConfigurationActions,
  FormConfigurationApiActions
} from './actions';

export interface FormConfigurationState {
  formMetadata: FormMetadata;
  pages: Page[];
  counter: number;
  formStatus: string;
  authoredFormDetailId: string;
  formDetailId: string;
  authoredFormDetailVersion: number;
}

const initialState = {
  formMetadata: {} as FormMetadata,
  pages: [] as Page[],
  counter: 0,
  formStatus: 'Draft',
  authoredFormDetailId: '',
  formDetailId: '',
  authoredFormDetailVersion: 1
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
    FormConfigurationApiActions.createFormSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      formMetadata: { ...state.formMetadata, ...action.formMetaData }
    })
  ),
  on(
    FormConfigurationApiActions.createAuthoredFromDetailSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      authoredFormDetailId: action.authoredFormDetail.id,
      authoredFormDetailVersion: action.authoredFormDetail.version + 1
    })
  ),
  on(
    FormConfigurationApiActions.createFormDetailSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      formStatus: 'Published',
      formMetadata: {
        ...state.formMetadata,
        formStatus: 'Published'
      },
      formDetailId: action.formDetail.id
    })
  ),
  on(
    FormConfigurationApiActions.updateFormDetailSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      formStatus: 'Published',
      formDetailId: action.formDetail.id
    })
  ),
  on(
    FormConfigurationActions.updateFormMetadata,
    (state, action): FormConfigurationState => {
      const { formStatus, ...formMetadata } = action.formMetadata;
      return {
        ...state,
        formMetadata: {
          ...state.formMetadata,
          ...formMetadata,
          formStatus:
            state.formStatus === 'Published' ? state.formStatus : formStatus
        },
        formStatus: 'Draft'
      };
    }
  ),
  on(
    FormConfigurationActions.updateCounter,
    (state, action): FormConfigurationState => ({
      ...state,
      counter: action.counter,
      formStatus: 'Draft'
    })
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
      ],
      formStatus: 'Draft'
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
      ],
      formStatus: 'Draft'
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
        pages,
        formStatus: 'Draft'
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
        pages,
        formStatus: 'Draft'
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
        pages,
        formStatus: 'Draft'
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
        pages,
        formStatus: 'Draft'
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
        pages,
        formStatus: 'Draft'
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
        pages,
        formStatus: 'Draft'
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
