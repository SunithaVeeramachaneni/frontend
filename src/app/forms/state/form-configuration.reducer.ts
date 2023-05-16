/* eslint-disable no-underscore-dangle */
import { createReducer, on } from '@ngrx/store';
import { FormMetadata, Page } from 'src/app/interfaces';
import {
  AddLogicActions,
  FormConfigurationActions,
  BuilderConfigurationActions,
  FormConfigurationApiActions,
  RoundPlanConfigurationApiActions
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
  isFormCreated: boolean;
  moduleName: string;
}

export interface TemplateConfigurationState {
  formMetadata: any;
  pages: Page[];
  counter: number;
  formStatus: string;
  authoredFormDetailVersion: number;
}

const initialState = {
  formMetadata: {} as FormMetadata,
  pages: [] as Page[],
  pdfBuilderConfiguration: {},
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
  authoredFormDetailDynamoDBVersion: 0,
  isFormCreated: false,
  moduleName: 'rdf'
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
    RoundPlanConfigurationApiActions.createRoundPlanSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      formMetadata: { ...state.formMetadata, ...action.formMetadata },
      formSaveStatus: action.formSaveStatus,
      formListDynamoDBVersion: state.formListDynamoDBVersion + 1
    })
  ),
  on(
    FormConfigurationApiActions.updateFormSuccess,
    RoundPlanConfigurationApiActions.updateRoundPlanSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      formSaveStatus: action.formSaveStatus,
      formListDynamoDBVersion: state.formListDynamoDBVersion + 1
    })
  ),
  on(
    FormConfigurationApiActions.createAuthoredFromDetailSuccess,
    RoundPlanConfigurationApiActions.createAuthoredRoundPlanDetailSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      authoredFormDetailId: action.authoredFormDetail.id,
      formSaveStatus: action.formSaveStatus,
      authoredFormDetailDynamoDBVersion: action.authoredFormDetail._version,
      isFormCreated: action.isFormCreated
    })
  ),
  on(
    FormConfigurationApiActions.updateAuthoredFromDetailSuccess,
    RoundPlanConfigurationApiActions.updateAuthoredRoundPlanDetailSuccess,
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
        formStatus: 'Published',
        isPublished: true
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
    RoundPlanConfigurationApiActions.publishRoundPlanSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      formStatus: action.formStatus,
      formMetadata: {
        ...state.formMetadata,
        formStatus: 'Published',
        isPublished: true
      },
      authoredFormDetailVersion: state.authoredFormDetailVersion + 1,
      isFormDetailPublished: false,
      formDetailPublishStatus: action.formDetailPublishStatus,
      formListDynamoDBVersion: state.formListDynamoDBVersion + 1,
      authoredFormDetailDynamoDBVersion: 1,
      authoredFormDetailId: action.authoredFormDetail.id
    })
  ),
  on(
    FormConfigurationActions.updateFormMetadata,
    BuilderConfigurationActions.updateFormMetadata,
    (state, action): FormConfigurationState => {
      const { formStatus, ...formMetadata } = action.formMetadata;
      return {
        ...state,
        formMetadata: {
          ...state.formMetadata,
          ...formMetadata
        },
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),
  on(
    FormConfigurationActions.updateIsFormDetailPublished,
    BuilderConfigurationActions.updateIsFormDetailPublished,
    (state, action): FormConfigurationState => ({
      ...state,
      isFormDetailPublished: action.isFormDetailPublished
    })
  ),
  on(
    FormConfigurationActions.updateFormPublishStatus,
    BuilderConfigurationActions.updateFormPublishStatus,
    (state, action): FormConfigurationState => ({
      ...state,
      formDetailPublishStatus: action.formDetailPublishStatus
    })
  ),
  on(
    FormConfigurationActions.updateCreateOrEditForm,
    BuilderConfigurationActions.updateCreateOrEditForm,
    (state, action): FormConfigurationState => ({
      ...state,
      createOrEditForm: action.createOrEditForm
    })
  ),
  on(
    FormConfigurationActions.updateCounter,
    BuilderConfigurationActions.updateCounter,
    (state, action): FormConfigurationState => ({
      ...state,
      counter: action.counter
    })
  ),
  on(
    FormConfigurationActions.addPage,
    BuilderConfigurationActions.addPage,
    (state, action): FormConfigurationState => ({
      ...state,
      pages: [
        ...state.pages.slice(0, action.pageIndex),
        action.page,
        ...state.pages
          .slice(action.pageIndex)
          .map((page) => ({ ...page, position: page.position + 1 }))
      ],
      formStatus: action.formStatus,
      formDetailPublishStatus: action.formDetailPublishStatus,
      formSaveStatus: action.formSaveStatus
    })
  ),
  on(
    FormConfigurationActions.updatePage,
    BuilderConfigurationActions.updatePage,
    (state, action): FormConfigurationState => {
      const updatedPageIdx = state.pages.findIndex(
        (page) => page.position === action.pageIndex + 1
      );
      const newPages = state.pages;
      newPages[updatedPageIdx] = {
        ...newPages[updatedPageIdx],
        ...action.page
      };
      return {
        ...state,
        pages: newPages,
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),
  on(
    FormConfigurationActions.updatePageState,
    BuilderConfigurationActions.updatePageState,
    (state, action): FormConfigurationState => ({
      ...state,
      pages: state.pages.map((page, index) => {
        if (action.pageIndex === index) {
          if (action.isOpen) {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const sections = page.sections.map((section) => ({
              ...section,
              isOpen: true
            }));
            return { ...page, sections, isOpen: action.isOpen };
          }
          const sections = page.sections.map((section) => ({
            ...section,
            isOpen: false
          }));
          const questions = page.questions.map((question) => ({
            ...question,
            isOpen: false,
            isResponseTypeModalOpen: false
          }));
          return { ...page, sections, questions, isOpen: action.isOpen };
        }
        return page;
      })
    })
  ),
  on(
    FormConfigurationActions.deletePage,
    BuilderConfigurationActions.deletePage,
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
    FormConfigurationActions.addSections,
    BuilderConfigurationActions.addSections,
    (state, action): FormConfigurationState => {
      const pages = state.pages.map((page, pageIndex) => {
        if (pageIndex === action.pageIndex) {
          const sections = [
            ...page.sections.slice(0, action.sectionIndex),
            ...action.sections,
            ...page.sections.slice(action.sectionIndex).map((section) => ({
              ...section,
              position: section.position + action.sections.length
            }))
          ];
          return {
            ...page,
            sections,
            questions: [...page.questions, ...action.questions]
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
    FormConfigurationActions.updateSection,
    BuilderConfigurationActions.updateSection,
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
    FormConfigurationActions.updateSectionState,
    BuilderConfigurationActions.updateSectionState,
    (state, action): FormConfigurationState => {
      const pages = state.pages.map((page, pageIndex) => {
        if (pageIndex === action.pageIndex) {
          return {
            ...page,
            sections: page.sections.map((section, sectionIndex) => {
              if (section.id === action.sectionId) {
                return { ...section, isOpen: action.isOpen };
              }
              return section;
            }),
            questions: page.questions.map((question) => {
              if (!action.isOpen && question.isOpen) {
                return {
                  ...question,
                  isOpen: false,
                  isResponseTypeModalOpen: false
                };
              }
              return question;
            })
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
    BuilderConfigurationActions.deleteSection,
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
    FormConfigurationActions.updatePageSections,
    BuilderConfigurationActions.updatePageSections,
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
    FormConfigurationActions.addQuestions,
    BuilderConfigurationActions.addQuestions,
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
            ...action.questions,
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
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),

  on(
    FormConfigurationActions.updateQuestion,
    BuilderConfigurationActions.updateQuestion,
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
    FormConfigurationActions.updateQuestionState,
    BuilderConfigurationActions.updateQuestionState,
    (state, action): FormConfigurationState => {
      const pages = state.pages.map((page) => {
        const questions = page.questions.map((question) => {
          if (question.id === action.questionId) {
            return {
              ...question,
              isOpen: action.isOpen,
              isResponseTypeModalOpen: action.isResponseTypeModalOpen
            };
          } else if (question.isOpen) {
            return {
              ...question,
              isOpen: false,
              isResponseTypeModalOpen: false
            };
          }
          return question;
        });
        return { ...page, questions };
      });
      return {
        ...state,
        pages
      };
    }
  ),
  on(
    FormConfigurationActions.updateQuestionBySection,
    BuilderConfigurationActions.updateQuestionBySection,
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
    BuilderConfigurationActions.deleteQuestion,
    (state, action): FormConfigurationState => {
      const pages = state.pages.map((page, pageIndex) => {
        if (pageIndex === action.pageIndex) {
          let sectionQuestions = page.questions.filter(
            (question) => question.sectionId === action.sectionId
          );
          if (action.questionIndex > 0) {
            sectionQuestions[action.questionIndex - 1].isOpen = true;
          }
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
    BuilderConfigurationActions.transferQuestionFromSection,
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

          sourceSectionQuestions = [
            ...sourceSectionQuestions.slice(0, action.previousIndex),
            ...sourceSectionQuestions
              .slice(action.previousIndex)
              .map((question) => ({
                ...question,
                position: question.position - 1
              }))
          ];

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
    BuilderConfigurationActions.updateFormConfiguration,
    (state, action): FormConfigurationState => ({
      ...state,
      ...action.formConfiguration
    })
  ),
  on(
    FormConfigurationActions.resetFormConfiguration,
    BuilderConfigurationActions.resetFormConfiguration,
    (state): FormConfigurationState => ({
      ...state,
      ...initialState
    })
  ),
  on(
    AddLogicActions.addLogicToQuestion,
    (state, action): FormConfigurationState => {
      const pages = state.pages.map((page, pageIndex) => {
        if (pageIndex === action.pageIndex) {
          return {
            ...page,
            logics: [...page.logics, action.logic]
          };
        }
        return page;
      });
      return {
        ...state,
        pages,
        formStatus: 'Draft',
        formDetailPublishStatus: 'Draft',
        formSaveStatus: 'Saving'
      };
    }
  ),

  on(
    AddLogicActions.removeLogicsOfQuestion,
    (state, action): FormConfigurationState => {
      const pages = state.pages.map((page, pageIndex) => {
        if (pageIndex === action.pageIndex) {
          const filteredLogics = page.logics.filter(
            (logic) => logic.questionId !== action.questionId
          );
          return {
            ...page,
            logics: [...filteredLogics]
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
    AddLogicActions.updateQuestionLogic,
    (state, action): FormConfigurationState => {
      const pages = state.pages.map((page, pageIndex) => {
        if (pageIndex === action.pageIndex) {
          const logics = page.logics.map((logic) => {
            const logicObj = Object.assign({}, logic);
            if (logic.id === action.logic.id) {
              return action.logic;
            }
            return logicObj;
          });

          return {
            ...page,
            logics
          };
        }
        return page;
      });
      return {
        ...state,
        pages,
        formStatus: 'Draft',
        formDetailPublishStatus: 'Draft',
        formSaveStatus: 'Saving'
      };
    }
  ),

  on(
    AddLogicActions.deleteQuestionLogic,
    (state, action): FormConfigurationState => {
      const pages = state.pages.map((page, pageIndex) => {
        if (pageIndex === action.pageIndex) {
          const filteredLogics = page.logics.filter(
            (l) => l.id !== action.logicId
          );
          return {
            ...page,
            logics: [...filteredLogics]
          };
        }
        return page;
      });
      return {
        ...state,
        pages,
        formStatus: 'Draft',
        formDetailPublishStatus: 'Draft',
        formSaveStatus: 'Saving'
      };
    }
  ),

  on(
    AddLogicActions.askQuestionsCreate,
    (state, action): FormConfigurationState => {
      const pages = state.pages.map((page, pageIndex) => {
        if (pageIndex === action.pageIndex) {
          page.questions.push(action.question);
          // const questions = JSON.parse(JSON.stringify(page.questions));
          // questions.push(action.question);
          return {
            ...page
            // questions
          };
        }
        return page;
      });
      return {
        ...state,
        pages,
        formStatus: 'Draft',
        formDetailPublishStatus: 'Draft',
        formSaveStatus: 'Saving'
      };
    }
  ),

  on(
    AddLogicActions.askQuestionsUpdate,
    (state, action): FormConfigurationState => {
      const pages = state.pages.map((page, pageIndex) => {
        if (pageIndex === action.pageIndex) {
          let questions = JSON.parse(JSON.stringify(page.questions));
          const questionIndex = questions.findIndex(
            (q) => q.id === action.questionId
          );
          questions = [
            ...questions.slice(0, questionIndex),
            action.question,
            ...questions.slice(questionIndex + 1)
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
        formStatus: 'Draft',
        formDetailPublishStatus: 'Draft',
        formSaveStatus: 'Saving'
      };
    }
  ),

  on(
    AddLogicActions.askQuestionsDelete,
    (state, action): FormConfigurationState => {
      const pages = state.pages.map((page, pageIndex) => {
        if (pageIndex === action.pageIndex) {
          const questions = JSON.parse(JSON.stringify(page.questions));
          const questionIndex = questions.findIndex(
            (q) => q.id === action.questionId
          );
          questions.splice(questionIndex, 1);
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
        formStatus: 'Draft',
        formDetailPublishStatus: 'Draft',
        formSaveStatus: 'Saving'
      };
    }
  ),
  on(
    FormConfigurationActions.initPages,
    BuilderConfigurationActions.initPages,
    (state, action): FormConfigurationState => ({
      ...state,
      pages: action.pages
    })
  ),
  on(
    FormConfigurationActions.resetPages,
    BuilderConfigurationActions.resetPages,
    (state, _): FormConfigurationState => ({
      ...state,
      pages: []
    })
  )
);
