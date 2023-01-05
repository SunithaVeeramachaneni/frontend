import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as AppState from '../../state/app.state';
import { FormConfigurationState } from './form-configuration.reducer';

export interface FromModuleState {
  formConfiguration: FormConfigurationState;
}

export interface State extends AppState.State {
  feature: FromModuleState;
}

const selectFeatureState = createFeatureSelector<FromModuleState>('feature');

const selectFormConfigurationState = createSelector(
  selectFeatureState,
  (state) => state.formConfiguration
);

export const getFormMetadata = createSelector(
  selectFormConfigurationState,
  (state) => state.formMetadata
);

export const getPages = createSelector(
  selectFormConfigurationState,
  (state) => state.pages
);

export const getPage = (pageIndex: number) =>
  createSelector(selectFormConfigurationState, (state) =>
    state.pages.find((page, index) => index === pageIndex)
  );

export const getPageIndexes = createSelector(
  selectFormConfigurationState,
  (state) => new Array(state.pages.length).fill(0).map((v, i) => i)
);

export const getSection = (pageIndex: number, sectionIndex: number) =>
  createSelector(selectFormConfigurationState, (state) =>
    state.pages
      .find((page, index) => index === pageIndex)
      .sections.find((section, index) => index === sectionIndex)
  );

export const getSectionIndexes = createSelector(
  selectFormConfigurationState,
  (state) =>
    state.pages.reduce((acc, curr, index) => {
      acc[index] = new Array(curr.sections.length).fill(0).map((v, i) => i);
      return acc;
    }, {})
);

export const getSectionIds = createSelector(
  selectFormConfigurationState,
  (state) =>
    state.pages.reduce((acc, curr, index) => {
      acc[index] = curr.sections.map((section) => section.id);
      return acc;
    }, {})
);

export const getQuestion = (
  pageIndex: number,
  sectionId: string,
  questionIndex: number
) =>
  createSelector(selectFormConfigurationState, (state) =>
    state.pages
      .find((page, index) => index === pageIndex)
      .questions.find(
        (question) =>
          question.sectionId === sectionId &&
          question.position === questionIndex + 1
      )
  );

export const getSectionQuestions = (pageIndex: number, sectionId: string) =>
  createSelector(selectFormConfigurationState, (state) =>
    state.pages
      .find((page, index) => index === pageIndex)
      .questions.filter((question) => question.sectionId === sectionId)
  );

export const getQuestionIndexes = createSelector(
  selectFormConfigurationState,
  (state) =>
    state.pages.reduce((acc, curr, index) => {
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
    }, {})
);
