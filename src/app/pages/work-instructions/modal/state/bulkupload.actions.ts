import { createAction, props } from "@ngrx/store";
import { Instruction, Step } from "../../../../interfaces";

export const addInstructionWithSteps = createAction(
  '[BulkUpload] addInstructionWithSteps',
  props<{instruction: Instruction, steps: Step[]}>()
);

export const resetInstructionWithSteps = createAction(
  '[BulkUpload] resetInstructionWithSteps'
);
