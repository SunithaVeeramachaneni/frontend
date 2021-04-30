import { createAction, props } from "@ngrx/store";
import { Instruction } from "../../../interfaces/instruction";
import { Step } from "../../../interfaces/step";
import { StepImages } from "./instruction.reducer";

export const addInstruction = createAction(
  '[Instruction] addInstruction',
  props<{ instruction: Instruction }>()
);

export const updateInstruction = createAction(
  '[Instruction] updateInstruction',
  props<{ instruction: Instruction }>()
);

export const resetInstructionState = createAction(
  '[Instruction] resetInstructionState'
);

export const addStep = createAction(
  '[Instruction] addStep',
  props<{ step: Step }>()
);

export const updateStep = createAction(
  '[Instruction] updateStep',
  props<{ step: Step }>()
);

export const removeStep = createAction(
  '[Instruction] removeStep',
  props<{ step: Step }>()
);

export const updateSteps = createAction(
  '[Instruction] updateSteps',
  props<{ steps: Step[] }>()
);

export const updateStepImages = createAction(
  '[Instruction] updateStepImages',
  props<{ stepImages: StepImages }>()
);

export const updateStepImagesContent = createAction(
  '[Instruction] updateStepImagesContent',
  props<{ attachment: string, imageContent: any }>()
);

export const removeStepImagesContent = createAction(
  '[Instruction] removeStepImagesContent',
  props<{ attachment: string }>()
);

export const removeStepImages = createAction(
  '[Instruction] removeStepImages',
  props<{ stepId: string }>()
);

export const setUploadedFile = createAction(
  '[Instruction] setUploadedFile',
  props<{ uploadedFile: string }>()
);

export const setInsToBePublished = createAction(
  '[Instruction] setInsToBePublished'
);
