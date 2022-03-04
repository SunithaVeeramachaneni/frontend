import { createFeatureSelector, createSelector } from "@ngrx/store";
import { InstructionState } from "./instruction.reducer";

const getInstructionFeatureState = createFeatureSelector<InstructionState>('workinstruction');

export const getInstruction = createSelector(
  getInstructionFeatureState,
  state => state.instruction
);

export const getInstructionId = createSelector(
  getInstructionFeatureState,
  state => state.instruction.Id
);

export const getInstuctionFavFlag = createSelector(
  getInstructionFeatureState,
  state => state.instruction.IsFavorite
);

export const getInsToBePublished = createSelector(
  getInstructionFeatureState,
  state => state.insToBePublished
);

export const getCurrentStepId = createSelector(
  getInstructionFeatureState,
  state => state.currentStepId
);

export const getUploadedFile = createSelector(
  getInstructionFeatureState,
  state => state.uploadedFile
);

export const getCurrentStepImages = createSelector(
  getInstructionFeatureState,
  getCurrentStepId,
  (state, stepId) => {
    return state.stepImages.find(step => step.stepId === stepId);
  }
);

export const getSteps = createSelector(
  getInstructionFeatureState,
  state => state.steps
);

export const getCurrentStep = createSelector(
  getInstructionFeatureState,
  getCurrentStepId,
  (state, stepId) => {
    return state.steps.find(step => step.StepId === stepId);
  }
);

export const getCategories = createSelector(
  getInstructionFeatureState,
  state => state.categories
);

