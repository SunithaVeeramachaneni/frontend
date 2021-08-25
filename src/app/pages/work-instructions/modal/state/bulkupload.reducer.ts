import { createReducer, on } from '@ngrx/store';
import { Instruction } from '../../../../interfaces/instruction';
import { Step } from '../../../../interfaces/step';
import * as AppState from '../../../../state/app.state';
import * as BulkUploadActions from './bulkupload.actions';

export interface State extends AppState.State {
  bulkupload: BulkuploadState;
}

export interface BulkuploadState {
  instructionsWithSteps: InstructionWithSteps[];
}

export interface InstructionWithSteps {
  instruction: Instruction;
  steps: Step[];
}

export const initialState: BulkuploadState = {
  instructionsWithSteps: []
};


const _bulkuploadReducer = createReducer<BulkuploadState>(
  initialState,
  on(BulkUploadActions.addInstructionWithSteps, (state, action): BulkuploadState  => {
    const { instruction, steps} = action;
    const instWithSteps = {instruction, steps};
    return {
      ...state,
      instructionsWithSteps: [...state.instructionsWithSteps, instWithSteps]
    };
  }),
  on(BulkUploadActions.resetInstructionWithSteps, (state): BulkuploadState => {
    return {
      ...state,
      ...initialState
    };
  })
);

export function bulkuploadReducer(state: BulkuploadState, action) {
  return _bulkuploadReducer(state, action);
}
