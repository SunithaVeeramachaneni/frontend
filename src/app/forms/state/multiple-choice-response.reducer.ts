import { createReducer, on } from '@ngrx/store';
import { MCQResponseApiActions } from './actions';

export interface ResponseSetState {
  globalResponses: any;
}

const initialState = {
  globalResponses: []
};

export const responseSetReducer = createReducer<ResponseSetState>(
  initialState,
  on(
    MCQResponseApiActions.getResponseSetSuccess,
    (state, action): ResponseSetState => ({
      globalResponses: action.responses.items
    })
  ),
  on(
    MCQResponseApiActions.createResponseSetSuccess,
    (state, action): ResponseSetState => ({
      globalResponses: [...state.globalResponses, action.response]
    })
  ),
  on(
    MCQResponseApiActions.updateResponseSetSuccess,
    (state, action): ResponseSetState => ({
      globalResponses: state.globalResponses.map((item) => {
        if (item.id === action.response.id) return action.response;
        return item;
      })
    })
  )
);
