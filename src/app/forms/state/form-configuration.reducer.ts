/* eslint-disable no-underscore-dangle */
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
  isFormDetailPublished: boolean;
  createOrEditForm: boolean;
  formSaveStatus: string;
  formDetailPublishStatus: string;
  formListDynamoDBVersion: number;
  formDetailDynamoDBVersion: number;
  authoredFormDetailDynamoDBVersion: number;
}

const initialState = {
  formMetadata: {} as FormMetadata,
  pages: [] as Page[],
  counter: 0,
  formStatus: 'Draft',
  authoredFormDetailId: '',
  formDetailId: '',
  authoredFormDetailVersion: 1,
  isFormDetailPublished: false,
  createOrEditForm: false,
  formSaveStatus: '',
  formDetailPublishStatus: '',
  formListDynamoDBVersion: 0,
  formDetailDynamoDBVersion: 0,
  authoredFormDetailDynamoDBVersion: 0
};

export const formConfigurationReducer = createReducer<FormConfigurationState>(
  initialState,
  on(
    FormConfigurationActions.addFormMetadata,
    (state, action): FormConfigurationState => ({
      ...state,
      formMetadata: { ...action.formMetadata },
      formDetailPublishStatus: action.formDetailPublishStatus,
      formSaveStatus: action.formSaveStatus
    })
  ),
  on(
    FormConfigurationApiActions.createFormSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      formMetadata: { ...state.formMetadata, ...action.formMetadata },
      formSaveStatus: action.formSaveStatus,
      formListDynamoDBVersion: state.formListDynamoDBVersion + 1
    })
  ),
  on(
    FormConfigurationApiActions.updateFormSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      formSaveStatus: action.formSaveStatus,
      formListDynamoDBVersion: state.formListDynamoDBVersion + 1
    })
  ),
  on(
    FormConfigurationApiActions.createAuthoredFromDetailSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      authoredFormDetailId: action.authoredFormDetail.id,
      formSaveStatus: action.formSaveStatus,
      authoredFormDetailDynamoDBVersion: action.authoredFormDetail._version
    })
  ),
  on(
    FormConfigurationApiActions.updateAuthoredFromDetailSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      formSaveStatus: action.formSaveStatus,
      authoredFormDetailDynamoDBVersion: action.authoredFormDetail._version
    })
  ),
  on(
    FormConfigurationApiActions.createFormDetailSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      formStatus: action.formStatus,
      formMetadata: {
        ...state.formMetadata,
        formStatus: 'Published'
      },
      formDetailId: action.formDetail.id,
      authoredFormDetailVersion: state.authoredFormDetailVersion + 1,
      isFormDetailPublished: false,
      formDetailPublishStatus: action.formDetailPublishStatus,
      formDetailDynamoDBVersion: action.formDetail._version,
      formListDynamoDBVersion: state.formListDynamoDBVersion + 1,
      authoredFormDetailDynamoDBVersion: 1,
      authoredFormDetailId: action.authoredFormDetail.id
    })
  ),
  on(
    FormConfigurationApiActions.updateFormDetailSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      formStatus: action.formStatus,
      formDetailId: action.formDetail.id,
      authoredFormDetailVersion: state.authoredFormDetailVersion + 1,
      isFormDetailPublished: false,
      formDetailPublishStatus: action.formDetailPublishStatus,
      formDetailDynamoDBVersion: action.formDetail._version,
      formListDynamoDBVersion: state.formListDynamoDBVersion + 1,
      authoredFormDetailDynamoDBVersion: 1,
      authoredFormDetailId: action.authoredFormDetail.id
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
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),
  on(
    FormConfigurationActions.updateIsFormDetailPublished,
    (state, action): FormConfigurationState => ({
      ...state,
      isFormDetailPublished: action.isFormDetailPublished
    })
  ),
  on(
    FormConfigurationActions.updateFormPublishStatus,
    (state, action): FormConfigurationState => ({
      ...state,
      formDetailPublishStatus: action.formDetailPublishStatus
    })
  ),
  on(
    FormConfigurationActions.updateCreateOrEditForm,
    (state, action): FormConfigurationState => ({
      ...state,
      createOrEditForm: action.createOrEditForm
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
      counter: action.questionCounter,
      formStatus: action.formStatus,
      formDetailPublishStatus: action.formDetailPublishStatus,
      formSaveStatus: action.formSaveStatus
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
      formStatus: action.formStatus,
      formDetailPublishStatus: action.formDetailPublishStatus,
      formSaveStatus: action.formSaveStatus
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
        counter: action.questionCounter,
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
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
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
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
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),
  on(
    FormConfigurationActions.updatePage,
    (state, action): FormConfigurationState => {
      const pages = state.pages.map((page, index) => {
        if (index === action.pageIndex) {
          const sectionPositionMap = action.data;
          let sections = page.sections.map((section, sectionIndex) => {
            const sec = Object.assign({}, section, {
              position: sectionPositionMap[section.id]
            });
            return sec;
          });
          sections = sections.sort((a, b) => a.position - b.position);
          return { ...page, sections };
        }
        return page;
      });
      return {
        ...state,
        pages,
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
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
        counter: action.questionCounter,
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),
  on(
    FormConfigurationActions.updateQuestion,
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
            ...sectionQuestions.slice(action.questionIndex + 1)
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
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),
  on(
    FormConfigurationActions.updateQuestionBySection,
    (state, action): FormConfigurationState => {
      const pages = state.pages.map((page, pageIndex) => {
        if (pageIndex === action.pageIndex) {
          const questions = page.questions.map((question) => {
            if (
              question.sectionId === action.sectionId &&
              question.position === action.question.position
            ) {
              return action.question;
            }
            return question;
          });
          return { ...page, questions };
        }
        return page;
      });
      return {
        ...state,
        pages,
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),
  on(
    FormConfigurationActions.deleteQuestion,
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
            ...sectionQuestions
              .slice(action.questionIndex + 1)
              .map((question) => ({
                ...question,
                position: question.position - 1
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
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),
  on(
    FormConfigurationActions.transferQuestionFromSection,
    (state, action): FormConfigurationState => {
      const pages = state.pages.map((page, pageIndex) => {
        if (pageIndex === action.pageIndex) {
          const questions = page.questions.map((question) => {
            if (question.id === action.questionId) {
              const que = Object.assign({}, question, {
                sectionId: action.destinationSectionId,
                position: action.currentIndex + 1
              });
              return que;
            }
            return question;
          });
          let sectionQuestions = questions.filter(
            (question) => question.sectionId === action.destinationSectionId
          );
          let sourceSectionQuestions = questions.filter(
            (question) => question.sectionId === action.sourceSectionId
          );

          const remainingQuestions = questions.filter(
            (question) =>
              question.sectionId !== action.destinationSectionId &&
              question.sectionId !== action.sourceSectionId
          );

          sectionQuestions = sectionQuestions.map((question, index) => {
            if (index > action.currentIndex) {
              const que = Object.assign({}, question, {
                position: index + 1
              });
              return que;
            }
            return question;
          });
          sectionQuestions = sectionQuestions.sort(
            (a, b) => a.position - b.position
          );

          sourceSectionQuestions = sourceSectionQuestions.map(
            (question, index) => {
              if (action.previousIndex === 0) {
                const que = Object.assign({}, question, {
                  position: index + 1
                });
                return que;
              }
              if (index >= action.previousIndex) {
                const que = Object.assign({}, question, {
                  position: index - 1
                });
                return que;
              }
              return question;
            }
          );

          return {
            ...page,
            questions: [
              ...sectionQuestions,
              ...sourceSectionQuestions,
              ...remainingQuestions
            ]
          };
        }
        return page;
      });
      return {
        ...state,
        pages,
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),
  on(
    FormConfigurationActions.updateFormConfiguration,
    (state, action): FormConfigurationState => ({
      ...state,
      ...action.formConfiguration
    })
  ),
  on(
    FormConfigurationActions.resetFormConfiguration,
    (state): FormConfigurationState => ({
      ...state,
      ...initialState
    })
  )
);
