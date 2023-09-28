import { createReducer, on } from '@ngrx/store';
import { QuickResponseActions } from './actions';

export interface QuickResponse {
  defaultResponses: any;
  formSpecificResponses: any;
}

const initialState: QuickResponse = {
  defaultResponses: [],
  formSpecificResponses: []
};

export const quickResponseReducer = createReducer<QuickResponse>(
  initialState,
  on(
    QuickResponseActions.setDefaultQuickResponses,
    (state, action): QuickResponse => ({
      ...state,
      defaultResponses: action.defaultResponses
    })
  ),
  on(
    QuickResponseActions.setFormSpecificQuickResponses,
    (state, action): QuickResponse => ({
      ...state,
      formSpecificResponses: action.formSpecificResponses
    })
  ),
  on(
    QuickResponseActions.setFormSpecificQuickResponse,
    (state, action): QuickResponse => ({
      ...state,
      formSpecificResponses: [
        ...state.formSpecificResponses,
        action.formSpecificResponse
      ]
    })
  ),
  on(
    QuickResponseActions.updateFormSpecificQuickResponse,
    (state, action): QuickResponse => ({
      ...state,
      formSpecificResponses: [
        ...state.formSpecificResponses.map((response) => {
          if (response.id === action.formSpecificResponse.id) {
            return action.formSpecificResponse;
          }
          return response;
        })
      ]
    })
  ),
  on(
    QuickResponseActions.resetQuickResponses,
    (): QuickResponse => ({
      ...initialState
    })
  ),
  on(
    QuickResponseActions.addFormSpecificQuickResponses,
    (state, action): QuickResponse => ({
      ...state,
      formSpecificResponses: [
        ...state.formSpecificResponses,
        ...action.formSpecificResponses
      ]
    })
  )
);
