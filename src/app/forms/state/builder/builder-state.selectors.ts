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

export const getFormConfigurationCounter = () =>
  createSelector(selectFormConfigurationState, (state) => state.counter);

export const getPagesCount = (subFormId) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    return state[key]?.length;
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

export const getImportedSectionsByTemplateId = (subFormId: string) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    const importedSectionsByTemplateId = {};
    for (const page of state[key] || []) {
      for (const section of page.sections) {
        if (section.isImported) {
          if (!importedSectionsByTemplateId[section.templateId])
            importedSectionsByTemplateId[section.templateId] = {};
          importedSectionsByTemplateId[section.templateId][
            section.externalSectionId
          ] = 1;
        }
      }
    }
    return importedSectionsByTemplateId;
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
          acc[index][question.sectionId] = [
            ...acc[index][question.sectionId],
            question.id
          ];
        } else {
          acc[index][question.sectionId] = [question.id];
        }
      });
      return acc;
    }, {});
  });

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

export const getPageWiseQuestionLogics = (subFormId: string) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    return state[key]?.reduce((acc, curr, index) => {
      acc[index] = curr.questions.reduce((questionLogicsAcc, currQuestion) => {
        const logics = curr.logics.filter(
          (logic) => logic.questionId === currQuestion.id
        );
        questionLogicsAcc[currQuestion.id] = {
          logics
        };
        return questionLogicsAcc;
      }, {});
      return acc;
    }, {});
  });

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
      ?.logics?.filter((logic) => logic.questionId === questionId);
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
      acc[index] = curr.sections.reduce((sectionsAcc, currSection) => {
        const questions = curr.questions.filter(
          (question) => question.sectionId === currSection.id
        );
        sectionsAcc[currSection.id] = {
          section: currSection,
          questions
        };
        const { sections, questions: ques, logics, ...page } = curr;
        return { ...sectionsAcc, page, pageQuestionsCount: ques.length };
      }, {});
      return acc;
    }, {});
  });

export const getPageWiseLogicsAskQuestions = (subFormId: string) =>
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

export const getPageWiseLogicSectionAskEvidenceQuestions = (
  subFormId: string
) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    return state[key]?.reduce((acc, curr, index) => {
      acc[index] = curr.logics.reduce((logicAcc, logicCurr) => {
        logicAcc[logicCurr.id] = curr.questions.filter(
          (question) => question.sectionId === `EVIDENCE_${logicCurr.id}`
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
      curr.sections.forEach((section) => {
        acc[index][section.id] = curr.questions.filter(
          (question) => question.sectionId === section.id
        );
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
