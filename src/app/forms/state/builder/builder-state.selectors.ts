import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as AppState from '../../../state/app.state';
import { FormConfigurationState } from './builder.reducer';

export interface FormModuleState {
  formConfiguration: FormConfigurationState;
}

export interface State extends AppState.State {
  feature: FormModuleState;
}

const selectFeatureState = createFeatureSelector<FormModuleState>('feature');

const selectFormConfigurationState = createSelector(
  selectFeatureState,
  (state) => state.formConfiguration
);

export const getFormMetadata = createSelector(
  selectFormConfigurationState,
  (state) => state.formMetadata
);

export const getPDFBuilderConfiguration = createSelector(
  selectFormConfigurationState,
  (state) => state.formMetadata.pdfTemplateConfiguration
);

export const getPages = createSelector(
  selectFormConfigurationState,
  (state) => state.pages
);

export const getModuleName = createSelector(
  selectFormConfigurationState,
  (state) => state.moduleName
);

export const getPagesCount = (subFormId) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    return state[key]?.length;
  });

export const getTasksCountByNodeId = (subFormId) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    const subForm = state[key] || [];
    let count = 0;
    // eslint-disable-next-line @typescript-eslint/dot-notation
    subForm.forEach((f) => {
      count += f.questions.length;
    });
    return count;
  });

export const getTasksCountByNodeIds = (subFormIds) =>
  createSelector(selectFormConfigurationState, (state) => {
    let count = 0;
    subFormIds.forEach((subFormId) => {
      let key = 'pages';
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      const subForm = state[key] || [];
      // eslint-disable-next-line @typescript-eslint/dot-notation
      subForm.forEach((f) => {
        count += f.questions.length;
      });
    });
    return count;
  });

export const getTotalTasksCount = (nodeIds) =>
  createSelector(selectFormConfigurationState, (state) => {
    let count = 0;
    const pageIds = nodeIds.map((id) => `pages_${id}`);
    const subFormKeys = Object.keys(state).filter(
      (sf) => pageIds.indexOf(sf) > -1
    );
    const allSubForms = [];
    subFormKeys.forEach((key) => {
      allSubForms.push(state[key]);
    });
    allSubForms.forEach((f) => {
      if (f) {
        f.forEach((page) => {
          if (page.questions && page.questions.length) {
            count += page.questions.length;
          }
        });
      }
    });
    return count;
  });

export const getSubFormPages = (subFormId) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    return state[key];
  });

export const getTotalTasksCountByHierarchy = (subFormIds) =>
  createSelector(selectFormConfigurationState, (state) => {
    let count = 0;
    let allPages = [];
    subFormIds.forEach((subFormId) => {
      let key = 'pages';
      if (subFormId) {
        key = `${key}_${subFormId}`;
      }
      if (state[key]) {
        allPages = [...allPages, ...state[key]];
      }
    });
    allPages.forEach((page) => {
      count = count + page.questions?.length;
    });
    return count;
  });

export const getPage = (pageIndex: number, subFormId: string) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }

    return state[key]?.find((page, index) => index === pageIndex);
  });

export const getPageIndexes = (subFormId: string) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    if (state[key]) {
      return new Array(state[key].length).fill(0).map((v, i) => i);
    } else {
      return [];
    }
  });

export const getSection = (
  pageIndex: number,
  sectionIndex: number,
  subFormId: string
) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    return state[key]
      ?.find((page, index) => index === pageIndex)
      ?.sections.find((section, index) => index === sectionIndex);
  });

export const getSectionsCount = (pageIndex: number, subFormId: string) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    return state[key]?.find((page, index) => index === pageIndex)?.sections
      .length;
  });

export const getTaskCountBySection = (
  pageIndex: number,
  sectionId: string,
  subFormId: string
) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    const page = state[key]?.find((p, index) => index === pageIndex);

    const questionsInSection = {};
    const questionIdByLogic = {};
    for (const logic of page?.logics)
      questionIdByLogic[logic.id] = logic.questionId;

    let count = 0;
    for (const question of page?.questions) {
      if (question.sectionId === sectionId) {
        count++;
        questionsInSection[question.id] = 1;
      }
    }
    for (const question of page?.questions) {
      if (
        question.sectionId !== sectionId &&
        question.sectionId.startsWith('AQ_') &&
        questionsInSection[questionIdByLogic[question.sectionId.substr(3)]] ===
          1
      )
        count++;
    }
    return count;
  });

export const getTaskCountByPage = (pageIndex: number, subFormId: string) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    const allQuestions = state[key]?.find(
      (page, index) => index === pageIndex
    )?.questions;
    return allQuestions?.length;
  });

export const getSectionIndexes = (subFormId: string) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    return state[key]?.reduce((acc, curr, index) => {
      acc[index] = new Array(curr.sections.length).fill(0).map((v, i) => i);
      return acc;
    }, {});
  });

export const getSectionIds = (subFormId: string) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    return state[key]?.reduce((acc, curr, index) => {
      acc[index] = curr.sections.map((section) => section.id);
      return acc;
    }, {});
  });

export const getQuestionIds = (subFormId: string) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    return state[key]?.reduce((acc, curr, index) => {
      acc[index] = {};
      curr.questions.forEach((question) => {
        if (acc[index][question.sectionId]) {
          acc[index][question.sectionId].push(question.id);
        } else {
          acc[index][question.sectionId] = [question.id];
        }
      });
      return acc;
    }, {});
  });

export const getQuestion = (
  pageIndex: number,
  sectionId: string,
  questionIndex: number
) =>
  createSelector(selectFormConfigurationState, (state) =>
    state.pages
      ?.find((page, index) => index === pageIndex)
      ?.questions.find(
        (question) =>
          question.sectionId === sectionId &&
          question.position === questionIndex + 1
      )
  );

export const getQuestionByID = (
  pageIndex: number,
  sectionId: string,
  questionId: string,
  subFormId: string
) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    return state[key]
      ?.find((page, index) => index === pageIndex)
      ?.questions.find(
        (question) =>
          question.sectionId === sectionId && question.id === questionId
      );
  });

export const getQuestionByQuestionID = (
  pageIndex: number,
  questionId: string
) =>
  createSelector(selectFormConfigurationState, (state) =>
    state.pages
      ?.find((page, index) => index === pageIndex)
      ?.questions.find((question) => question.id === questionId)
  );

export const getQuestionLogics = (
  pageIndex: number,
  questionId: string,
  subFormId: string
) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    return state[key]
      ?.find((page, index) => index === pageIndex)
      .logics?.filter((logic) => logic.questionId === questionId);
  });

export const getSectionQuestions = (
  pageIndex: number,
  sectionId: string,
  subFormId: string
) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    return state[key]
      ?.find((page, index) => index === pageIndex)
      ?.questions.filter((question) => question.sectionId === sectionId);
  });

export const getPageWiseSectionQuestions = (subFormId: string) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }

    return state[key]?.reduce((acc, curr, index) => {
      acc[index] = curr.sections.reduce((sectionAcc, sectionCurr) => {
        sectionAcc[sectionCurr.id] = curr.questions.filter(
          (question) => question.sectionId === sectionCurr.id
        );
        return sectionAcc;
      }, {});
      return acc;
    }, {});
  });

export const getPageWiseLogicSectionAskQuestions = (subFormId: string) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    return state[key]?.reduce((acc, curr, index) => {
      acc[index] = curr.logics.reduce((logicAcc, logicCurr) => {
        logicAcc[logicCurr.id] = curr.questions.filter(
          (question) => question.sectionId === `AQ_${logicCurr.id}`
        );
        return logicAcc;
      }, {});
      return acc;
    }, {});
  });

export const getPageWiseSections = (subFormId: string) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }

    return state[key]?.reduce((acc, curr, index) => {
      acc[index] = curr.sections;
      return acc;
    }, {});
  });

export const getNodeWiseQuestionsCount = () =>
  createSelector(selectFormConfigurationState, (state) => {
    const nodeIds =
      Object.keys(state).filter((key) => key.indexOf('pages_') === 0) || [];
    return nodeIds.reduce((acc, curr) => {
      acc[curr.substring(6)] = state[curr].reduce(
        (count, page) => (count += page.questions.length),
        0
      );
      return acc;
    }, {});
  });

export const getSectionQuestionsCount = (
  pageIndex: number,
  sectionId: string,
  subFormId: string
) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    return state[key]
      ?.find((page, index) => index === pageIndex)
      ?.questions.filter((question) => question.sectionId === sectionId).length;
  });

export const getQuestionIndexes = (subFormId: string) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    return state[key]?.reduce((acc, curr, index) => {
      acc[index] = {};
      curr.sections.forEach((section, sectionIndex) => {
        acc[index][sectionIndex] = new Array(
          curr.questions.filter(
            (question) => question.sectionId === section.id
          ).length
        )
          .fill(0)
          .map((v, i) => i);
      });
      return acc;
    }, {});
  });

export const getFormDetails = createSelector(
  selectFormConfigurationState,
  (state) => ({ ...state })
);

export const getCreateOrEditForm = createSelector(
  selectFormConfigurationState,
  (state) => state.createOrEditForm
);

export const getFormSaveStatus = createSelector(
  selectFormConfigurationState,
  (state) => state.formSaveStatus
);

export const getFormPublishStatus = createSelector(
  selectFormConfigurationState,
  (state) => state.formDetailPublishStatus
);

export const getIsFormCreated = createSelector(
  selectFormConfigurationState,
  (state) => state.isFormCreated
);

export const getQuestionCounter = createSelector(
  selectFormConfigurationState,
  (state) => state.counter
);
