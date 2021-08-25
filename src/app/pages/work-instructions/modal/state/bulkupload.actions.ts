import { createAction, props } from "@ngrx/store";
import { Instruction } from "../../../../interfaces/instruction";
import { Step } from "../../../../interfaces/step";

export const addInstructionWithSteps = createAction(
  '[BulkUpload] addInstructionWithSteps',
  props<{instruction: Instruction, steps: Step[]}>()
);

export const resetInstructionWithSteps = createAction(
  '[BulkUpload] resetInstructionWithSteps'
);
