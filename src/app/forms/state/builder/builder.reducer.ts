/* eslint-disable no-underscore-dangle */
import { createReducer, on } from '@ngrx/store';
import {
  DEFAULT_PDF_BUILDER_CONFIG,
  formConfigurationStatus
} from 'src/app/app.constants';
import { FormMetadata, Page } from 'src/app/interfaces';
import {
  AddLogicActions,
  BuilderConfigurationActions,
  BuilderConfigurationsApiActions,
  FormConfigurationApiActions,
  RoundPlanConfigurationApiActions
} from '../actions';
import { cloneDeep } from 'lodash-es';

export interface FormConfigurationState {
  formMetadata: FormMetadata;
  pages: Page[];
  subForms?: Page[];
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
  skipAuthoredDetail: boolean;
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
  isFormCreated: false,
  moduleName: 'operator-rounds',
  skipAuthoredDetail: false
};

export const formConfigurationReducer = createReducer<FormConfigurationState>(
  initialState,
  on(
    BuilderConfigurationActions.addFormMetadata,
    (state, action): FormConfigurationState => ({
      ...state,
      formMetadata: {
        ...action.formMetadata,
        pdfTemplateConfiguration: DEFAULT_PDF_BUILDER_CONFIG
      },
      formDetailPublishStatus: action.formDetailPublishStatus,
      formSaveStatus: action.formSaveStatus,
      skipAuthoredDetail: false
    })
  ),
  on(
    FormConfigurationApiActions.createFormSuccess,
    RoundPlanConfigurationApiActions.createRoundPlanSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      formMetadata: { ...state.formMetadata, ...action.formMetadata },
      formSaveStatus: action.formSaveStatus,
      formListDynamoDBVersion: state.formListDynamoDBVersion + 1,
      skipAuthoredDetail: false
    })
  ),
  on(
    FormConfigurationApiActions.updateFormSuccess,
    RoundPlanConfigurationApiActions.updateRoundPlanSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      formSaveStatus: action.formSaveStatus,
      formListDynamoDBVersion: state.formListDynamoDBVersion + 1,
      skipAuthoredDetail: true
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
      isFormCreated: action.isFormCreated,
      skipAuthoredDetail: true
    })
  ),
  on(
    FormConfigurationApiActions.updateAuthoredFromDetailSuccess,
    RoundPlanConfigurationApiActions.updateAuthoredRoundPlanDetailSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      formSaveStatus: action.formSaveStatus,
      authoredFormDetailDynamoDBVersion: action.authoredFormDetail._version,
      skipAuthoredDetail: true
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
      authoredFormDetailId: action.authoredFormDetail.id,
      skipAuthoredDetail: true
    })
  ),
  on(
    BuilderConfigurationsApiActions.updateFormDetailSuccess,
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
      authoredFormDetailId: action.authoredFormDetail.id,
      skipAuthoredDetail: true
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
        formSaveStatus: action.formSaveStatus,
        skipAuthoredDetail: true
      };
    }
  ),
  on(
    BuilderConfigurationActions.updatePDFBuilderConfiguration,
    (state, action): FormConfigurationState => ({
      ...state,
      formMetadata: {
        ...state.formMetadata,
        pdfTemplateConfiguration: action.pdfBuilderConfiguration
      },
      skipAuthoredDetail: false
    })
  ),
  on(
    BuilderConfigurationActions.updateIsFormDetailPublished,
    (state, action): FormConfigurationState => ({
      ...state,
      isFormDetailPublished: action.isFormDetailPublished,
      skipAuthoredDetail: false
    })
  ),
  on(
    BuilderConfigurationActions.updateFormPublishStatus,
    (state, action): FormConfigurationState => ({
      ...state,
      formDetailPublishStatus: action.formDetailPublishStatus,
      skipAuthoredDetail: false
    })
  ),
  on(
    BuilderConfigurationActions.updateCreateOrEditForm,
    (state, action): FormConfigurationState => ({
      ...state,
      createOrEditForm: action.createOrEditForm,
      skipAuthoredDetail: false
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
        [key]: initPage,
        skipAuthoredDetail: false
      };
    }
  ),
  on(
    BuilderConfigurationActions.removeSubForm,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      const subFormId = action.subFormId;
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      delete state[key];
      return { ...state, skipAuthoredDetail: false };
    }
  ),
  on(
    BuilderConfigurationActions.removeSubFormInstances,
    (state, action): FormConfigurationState => {
      const subFormIds = action.subFormIds;
      subFormIds.forEach((subFormId) => {
        let key = 'pages';
        if (subFormId) {
          key = `${key}_${subFormId}`;
        }
        delete state[key];
      });
      return { ...state, skipAuthoredDetail: false };
    }
  ),
  on(
    BuilderConfigurationActions.addLogics,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      if (action.subFormId) {
        key = `${key}_${action.subFormId}`;
      }
      const pageToBeUpdated = state[key] || [];
      const idx = pageToBeUpdated.findIndex(
        (page) => page.position === action.pageIndex + 1
      );
      const newArray = cloneDeep(pageToBeUpdated);
      newArray[idx] = {
        ...newArray[idx],
        logics: [...newArray[idx].logics, ...(action.logics || [])]
      };
      return {
        ...state,
        [key]: [...newArray],
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus,
        skipAuthoredDetail: true
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
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus,
        counter: action.counter,
        skipAuthoredDetail: false
      };
    }
  ),
  on(
    BuilderConfigurationActions.updatePage,
    (state, action): FormConfigurationState => {
      let key = 'pages';
      if (action.subFormId) {
        key = `${key}_${action.subFormId}`;
      }
      const pageToBeUpdated = state[key] || [];
      const idx = pageToBeUpdated.findIndex(
        (page) => page.position === action.pageIndex + 1
      );
      pageToBeUpdated[idx] = {
        ...pageToBeUpdated[idx],
        ...action.page
      };
      return {
        ...state,
        [key]: [...pageToBeUpdated],
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus,
        skipAuthoredDetail: false
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
        }),
        skipAuthoredDetail: true
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
        formSaveStatus: action.formSaveStatus,
        skipAuthoredDetail: false
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
        formSaveStatus: action.formSaveStatus,
        counter: action.counter,
        skipAuthoredDetail: false
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
        [key]: [...pages],
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus,
        skipAuthoredDetail: false
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
        [key]: pages,
        skipAuthoredDetail: false
      };
    }
  ),
  on(
    RoundPlanConfigurationApiActions.publishRoundPlanSuccess,
    (state, action): FormConfigurationState => ({
      ...state,
      formStatus: action.formStatus,
      formMetadata: {
        ...state.formMetadata,
        formStatus: 'Published'
      },
      authoredFormDetailVersion: state.authoredFormDetailVersion + 1,
      isFormDetailPublished: false,
      formDetailPublishStatus: action.formDetailPublishStatus,
      formListDynamoDBVersion: state.formListDynamoDBVersion + 1,
      authoredFormDetailDynamoDBVersion: 1,
      authoredFormDetailId: action.authoredFormDetail.id,
      skipAuthoredDetail: true
    })
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
          const questionsInSection = {};
          const questionIdByLogic = {};
          for (const logic of page.logics)
            questionIdByLogic[logic.id] = logic.questionId;

          for (const question of page.questions) {
            if (question.sectionId === action.sectionId) {
              questionsInSection[question.id] = 1;
            }
          }
          const questions = page.questions.filter((question) => {
            if (question.sectionId !== action.sectionId) {
              if (question.sectionId.startsWith('AQ_')) {
                if (
                  !questionsInSection[
                    questionIdByLogic[question.sectionId.substr(3)]
                  ]
                )
                  return true;
              } else {
                return true;
              }
            }
          });
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
        formSaveStatus: action.formSaveStatus,
        skipAuthoredDetail: false
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
        formSaveStatus: action.formSaveStatus,
        skipAuthoredDetail: false
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
        formSaveStatus: action.formSaveStatus,
        counter: action.counter,
        skipAuthoredDetail: false
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
        formSaveStatus: action.formSaveStatus,
        skipAuthoredDetail: false
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
        [key]: pages,
        skipAuthoredDetail: true
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
        formSaveStatus: action.formSaveStatus,
        skipAuthoredDetail: false
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
          const questionIdByLogic = {};
          for (const logic of page.logics)
            questionIdByLogic[logic.id] = logic.questionId;

          let sectionQuestions = cloneDeep(
            page.questions.filter(
              (question) => question.sectionId === action.sectionId
            )
          );
          const questionToBeDeleted =
            sectionQuestions[action.questionIndex]?.id;
          const remainingQuestions = page.questions.filter((question) => {
            if (question.sectionId !== action.sectionId) {
              if (questionToBeDeleted && question.sectionId.startsWith('AQ_')) {
                if (
                  questionIdByLogic[question.sectionId.substr(3)] !==
                  questionToBeDeleted
                )
                  return true;
              } else {
                return true;
              }
            }
          });
          if (action.questionIndex > 0) {
            sectionQuestions[action.questionIndex - 1].isOpen = true;
          }

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
        formSaveStatus: action.formSaveStatus,
        skipAuthoredDetail: false
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
        [key]: pages,
        formStatus: action.formStatus,
        formDetailPublishStatus: action.formDetailPublishStatus,
        formSaveStatus: action.formSaveStatus,
        skipAuthoredDetail: false
      };
    }
  ),
  on(
    BuilderConfigurationActions.updateFormConfiguration,
    (state, action): FormConfigurationState => ({
      ...state,
      ...action.formConfiguration,
      skipAuthoredDetail: true
    })
  ),
  on(
    BuilderConfigurationActions.resetFormConfiguration,
    (): FormConfigurationState => ({
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
        formSaveStatus: 'Saving',
        skipAuthoredDetail: false
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
          const logicsToBeDeleted = {};
          const filteredLogics = page.logics.filter((logic) => {
            if (logic.questionId === action.questionId)
              logicsToBeDeleted['AQ_' + logic.id] = 1;
            return logic.questionId !== action.questionId;
          });
          const filteredQuestions = page.questions.filter(
            (question) => !logicsToBeDeleted[question.sectionId]
          );
          return {
            ...page,
            logics: [...filteredLogics],
            questions: [...filteredQuestions]
          };
        }
        return page;
      });
      return {
        ...state,
        [key]: pages,
        skipAuthoredDetail: false
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
        formSaveStatus: 'Saving',
        skipAuthoredDetail: false
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
          const questions = state[key][action.pageIndex]?.questions.filter(
            (question) => question.sectionId !== `AQ_${action.logicId}`
          );

          const filteredLogics = page.logics.filter(
            (l) => l.id !== action.logicId
          );
          return {
            ...page,
            logics: [...filteredLogics],
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
        formSaveStatus: 'Saving',
        skipAuthoredDetail: false
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
          return { ...page, questions: [...page.questions, action.question] };
        }
        return page;
      });
      return {
        ...state,
        [key]: pages,
        formStatus: 'Draft',
        formDetailPublishStatus: 'Draft',
        formSaveStatus: 'Saving',
        skipAuthoredDetail: false
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
        formSaveStatus: 'Saving',
        skipAuthoredDetail: false
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
        formSaveStatus: 'Saving',
        skipAuthoredDetail: false
      };
    }
  ),
  on(
    BuilderConfigurationActions.updateFormStatuses,
    (state, action): FormConfigurationState => ({
      ...state,
      ...action
    })
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
        [key]: action.pages,
        skipAuthoredDetail: false
      };
    }
  ),
  on(
    BuilderConfigurationActions.publishTemplate,
    (state, _): FormConfigurationState => ({
      ...state,
      formStatus: formConfigurationStatus.ready,
      formDetailPublishStatus: formConfigurationStatus.ready,
      isFormDetailPublished: false
    })
  ),
  on(
    BuilderConfigurationActions.replacePagesAndCounter,
    (state, action): FormConfigurationState => ({
      ...state,
      pages: action.pages,
      counter: action.counter,
      skipAuthoredDetail: false
    })
  )
);
