import { createReducer, on } from '@ngrx/store';
import { FormMetadata, Page } from 'src/app/interfaces';
import { FormConfigurationActions } from './actions';

export interface FormConfigurationState {
  formMetadata: FormMetadata;
  pages: Page[];
}

const initialState = {
  formMetadata: {} as FormMetadata,
  pages: [] as Page[]
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
      const pages = state.pages.map((page, index) => {
        if (index === action.pageIndex) {
          const sections = page.sections.map((section) => {
            if (section.position === action.section.position) {
              return action.section;
            }
            return section;
          });
          return { ...page, sections };
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
          let questionsSorted = [];
          sections.forEach((section) => {
            const ques = page.questions.filter(
              (question) => question.sectionId === section.id
            );
            questionsSorted = questionsSorted.concat(ques);
          });
          console.log({ ...page, questions: questionsSorted, sections });
          return { ...page, sections };
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
        pages
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
