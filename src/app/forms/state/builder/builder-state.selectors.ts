import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as AppState from '../../../state/app.state';
import { ResponseSetState } from '../multiple-choice-response.reducer';
import { FormConfigurationState } from './builder.reducer';

export interface FromModuleState {
  formConfiguration: FormConfigurationState;
  responseSet: ResponseSetState;
}

export interface State extends AppState.State {
  feature: FromModuleState;
}

const selectFeatureState = createFeatureSelector<FromModuleState>('feature');

const selectFormConfigurationState = createSelector(
  selectFeatureState,
  (state) => state.formConfiguration
);

const selectResponseSetState = createSelector(
  selectFeatureState,
  (state) => state.responseSet
);

export const getFormMetadata = createSelector(
  selectFormConfigurationState,
  (state) => state.formMetadata
);

export const getPages = createSelector(
  selectFormConfigurationState,
  (state) => state.pages
);

export const getPagesCount = createSelector(
  selectFormConfigurationState,
  (state) => state.pages.length
);

export const getSubFormPages = (subFormId) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    return state[key];
  });

export const getPage = (pageIndex: number, subFormId: string) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }

    return state[key].find((page, index) => index === pageIndex);
  });

export const getPageIndexes = (subFormId: string) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    return new Array(state[key].length).fill(0).map((v, i) => i);
  });

export const getSection = (pageIndex: number, sectionIndex: number) =>
  createSelector(selectFormConfigurationState, (state) =>
    state.pages
      .find((page, index) => index === pageIndex)
      ?.sections.find((section, index) => index === sectionIndex)
  );

export const getSectionsCount = (pageIndex: number) =>
  createSelector(
    selectFormConfigurationState,
    (state) =>
      state.pages.find((page, index) => index === pageIndex)?.sections.length
  );

export const getSectionIndexes = (subFormId: string) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    return state[key].reduce((acc, curr, index) => {
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
    return state[key].reduce((acc, curr, index) => {
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
    return state[key].reduce((acc, curr, index) => {
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
      .find((page, index) => index === pageIndex)
      ?.questions.find(
        (question) =>
          question.sectionId === sectionId &&
          question.position === questionIndex + 1
      )
  );

export const getQuestionByID = (
  pageIndex: number,
  sectionId: string,
  questionId: string
) =>
  createSelector(selectFormConfigurationState, (state) =>
    state.pages
      .find((page, index) => index === pageIndex)
      ?.questions.find(
        (question) =>
          question.sectionId === sectionId && question.id === questionId
      )
  );

export const getQuestionByQuestionID = (
  pageIndex: number,
  questionId: string
) =>
  createSelector(selectFormConfigurationState, (state) =>
    state.pages
      .find((page, index) => index === pageIndex)
      ?.questions.find((question) => question.id === questionId)
  );

export const getQuestionLogics = (pageIndex: number, questionId: string) =>
  createSelector(selectFormConfigurationState, (state) =>
    state.pages
      .find((page, index) => index === pageIndex)
      .logics?.filter((logic) => logic.questionId === questionId)
  );

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
      .find((page, index) => index === pageIndex)
      ?.questions.filter((question) => question.sectionId === sectionId);
  });

export const getSectionQuestionsCount = (
  pageIndex: number,
  sectionId: string
) =>
  createSelector(
    selectFormConfigurationState,
    (state) =>
      state.pages
        .find((page, index) => index === pageIndex)
        ?.questions.filter((question) => question.sectionId === sectionId)
        .length
  );

export const getQuestionIndexes = (subFormId: string) =>
  createSelector(selectFormConfigurationState, (state) => {
    let key = 'pages';
    if (subFormId) {
      key = `${key}_${subFormId}`;
    }
    return state[key].reduce((acc, curr, index) => {
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

// Selectors for response sets begin here

export const getResponseSets = createSelector(
  selectResponseSetState,
  (state) => state.globalResponses
);
