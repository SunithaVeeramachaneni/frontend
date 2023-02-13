/* eslint-disable no-underscore-dangle */
import { createReducer, on } from '@ngrx/store';
import { FormMetadata, Page } from 'src/app/interfaces';
import {
  AddLogicActions,
  BuilderConfigurationActions,
  BuilderConfigurationsApiActions,
  RoundPlanConfigurationApiActions
} from '../actions';

export interface FormConfigurationState {
  formMetadata: FormMetadata;
  pages: Page[];
  subForms?: any[];
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
  authoredFormDetailDynamoDBVersion: 0,
  isFormCreated: false
};

export const formConfigurationReducer = createReducer<FormConfigurationState>(
  initialState,
  on(
    BuilderConfigurationActions.addFormMetadata,
    (state, action): FormConfigurationState => ({
      ...state,
      formMetadata: { ...action.formMetadata },
      formDetailPublishStatus: action.formDetailPublishStatus,
      formSaveStatus: action.formSaveStatus
    })
  ),
  on(
    BuilderConfigurationsApiActions.createFormSuccess,
    RoundPlanConfigurationApiActions.createRoundPlanSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      formMetadata: { ...state.formMetadata, ...action.formMetadata },
      formSaveStatus: action.formSaveStatus,
      formListDynamoDBVersion: state.formListDynamoDBVersion + 1
    })
  ),
  on(
    BuilderConfigurationsApiActions.updateFormSuccess,
    RoundPlanConfigurationApiActions.updateRoundPlanSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      formSaveStatus: action.formSaveStatus,
      formListDynamoDBVersion: state.formListDynamoDBVersion + 1
    })
  ),
  on(
    BuilderConfigurationsApiActions.createAuthoredFromDetailSuccess,
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
    BuilderConfigurationsApiActions.updateAuthoredFromDetailSuccess,
    RoundPlanConfigurationApiActions.updateAuthoredRoundPlanDetailSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      formSaveStatus: action.formSaveStatus,
      authoredFormDetailDynamoDBVersion: action.authoredFormDetail._version
    })
  ),
  on(
    BuilderConfigurationsApiActions.createFormDetailSuccess,
    RoundPlanConfigurationApiActions.createRoundPlanDetailSuccess,
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
    BuilderConfigurationsApiActions.updateFormDetailSuccess,
    RoundPlanConfigurationApiActions.updateRoundPlanDetailSuccess,
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
    BuilderConfigurationActions.updateIsFormDetailPublished,
    (state, action): FormConfigurationState => ({
      ...state,
      isFormDetailPublished: action.isFormDetailPublished
    })
  ),
  on(
    BuilderConfigurationActions.updateFormPublishStatus,
    (state, action): FormConfigurationState => ({
      ...state,
      formDetailPublishStatus: action.formDetailPublishStatus
    })
  ),
  on(
    BuilderConfigurationActions.updateCreateOrEditForm,
    (state, action): FormConfigurationState => ({
      ...state,
      createOrEditForm: action.createOrEditForm
    })
  ),
  on(
    BuilderConfigurationActions.updateCounter,
    (state, action): FormConfigurationState => ({
      ...state,
      counter: action.counter
    })
  ),
  on(
    BuilderConfigurationActions.initPage,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      let initPage = [];
      if (state[key]) {
        initPage = state[key];
      }
      return {
        ...state,
        [key]: initPage
      };
    }
  ),
  on(
    BuilderConfigurationActions.addPage,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      if (!state[key]) {
        state[key] = [];
      }
      return {
        ...state,
        [key]: [
          ...state[key].slice(0, action.pageIndex),
          action.page,
          ...state[key]
            .slice(action.pageIndex)
            .map((page) => ({ ...page, position: page.position + 1 }))
        ],
        // pages: [
        //   ...state.pages.slice(0, action.pageIndex),
        //   action.page,
        //   ...state.pages
        //     .slice(action.pageIndex)
        //     .map((page) => ({ ...page, position: page.position + 1 }))
        // ],
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),
  on(
    BuilderConfigurationActions.updatePageState,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      return {
        ...state,
        [key]: state[key].map((page, index) => {
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
      };
    }
  ),
  on(
    BuilderConfigurationActions.deletePage,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }

      return {
        ...state,
        [key]: [
          ...state[key].slice(0, action.pageIndex),
          ...state[key]
            .slice(action.pageIndex + 1)
            .map((page) => ({ ...page, position: page.position - 1 }))
        ],
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),

  on(
    BuilderConfigurationActions.addSections,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      const pages = state[key].map((page, pageIndex) => {
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
        [key]: pages,
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),
  on(
    BuilderConfigurationActions.updateSection,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      const pages = state[key].map((page, pageIndex) => {
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
        [key]: pages,
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),
  on(
    BuilderConfigurationActions.updateSectionState,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      const pages = state[key].map((page, pageIndex) => {
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
        [key]: pages
      };
    }
  ),
  on(
    BuilderConfigurationActions.deleteSection,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      const pages = state[key].map((page, pageIndex) => {
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
        [key]: pages,
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),
  on(
    BuilderConfigurationActions.updatePageSections,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      const pages = state[key].map((page, index) => {
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
        [key]: pages,
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),
  on(
    BuilderConfigurationActions.addQuestions,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      const pages = state[key].map((page, pageIndex) => {
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
        [key]: pages,
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),

  on(
    BuilderConfigurationActions.updateQuestion,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      const pages = state[key].map((page, pageIndex) => {
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
        [key]: pages,
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),

  on(
    BuilderConfigurationActions.updateQuestionState,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      const pages = state[key].map((page) => {
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
        [key]: pages
      };
    }
  ),
  on(
    BuilderConfigurationActions.updateQuestionBySection,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      const pages = state[key].map((page, pageIndex) => {
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
        [key]: pages,
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),
  on(
    BuilderConfigurationActions.deleteQuestion,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      const pages = state[key].map((page, pageIndex) => {
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
        [key]: pages,
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),
  on(
    BuilderConfigurationActions.transferQuestionFromSection,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      const pages = state[key].map((page, pageIndex) => {
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
        [key]: pages,
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus
      };
    }
  ),
  on(
    BuilderConfigurationActions.updateFormConfiguration,
    (state, action): FormConfigurationState => ({
      ...state,
      ...action.formConfiguration
    })
  ),
  on(
    BuilderConfigurationActions.resetFormConfiguration,
    (state): FormConfigurationState => ({
      ...state,
      ...initialState
    })
  ),
  on(
    AddLogicActions.addLogicToQuestion,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      const pages = state[key].map((page, pageIndex) => {
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
        [key]: pages,
        formStatus: 'Draft',
        formDetailPublishStatus: 'Draft',
        formSaveStatus: 'Saving'
      };
    }
  ),

  on(
    AddLogicActions.removeLogicsOfQuestion,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      const pages = state[key].map((page, pageIndex) => {
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
        [key]: pages
      };
    }
  ),

  on(
    AddLogicActions.updateQuestionLogic,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      const pages = state[key].map((page, pageIndex) => {
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
        [key]: pages,
        formStatus: 'Draft',
        formDetailPublishStatus: 'Draft',
        formSaveStatus: 'Saving'
      };
    }
  ),

  on(
    AddLogicActions.deleteQuestionLogic,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      const pages = state[key].map((page, pageIndex) => {
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
        [key]: pages,
        formStatus: 'Draft',
        formDetailPublishStatus: 'Draft',
        formSaveStatus: 'Saving'
      };
    }
  ),

  on(
    AddLogicActions.askQuestionsCreate,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      const pages = state[key].map((page, pageIndex) => {
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
        [key]: pages,
        formStatus: 'Draft',
        formDetailPublishStatus: 'Draft',
        formSaveStatus: 'Saving'
      };
    }
  ),

  on(
    AddLogicActions.askQuestionsUpdate,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      const pages = state[key].map((page, pageIndex) => {
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
        [key]: pages,
        formStatus: 'Draft',
        formDetailPublishStatus: 'Draft',
        formSaveStatus: 'Saving'
      };
    }
  ),

  on(
    AddLogicActions.askQuestionsDelete,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      const pages = state[key].map((page, pageIndex) => {
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
        [key]: pages,
        formStatus: 'Draft',
        formDetailPublishStatus: 'Draft',
        formSaveStatus: 'Saving'
      };
    }
  ),
  on(
    BuilderConfigurationActions.initPages,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      return {
        ...state,
        [key]: action.pages
      };
    }
  ),
  on(
    BuilderConfigurationActions.resetPages,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      return { ...state, [key]: [] };
    }
  )
);
