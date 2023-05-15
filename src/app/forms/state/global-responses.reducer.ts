import { createReducer, on } from '@ngrx/store';
import { GlobalResponseActions } from './actions';

export interface GlobalResponse {
  list: any;
}

const initialState: GlobalResponse = {
  list: []
};

export const globalResponseReducer = createReducer<GlobalResponse>(
  initialState,
  on(
    GlobalResponseActions.setGlobalResponses,
    (state, action): GlobalResponse => ({
      ...state,
      list: action.list
    })
  ),
  on(
    GlobalResponseActions.setGlobalResponse,
    (state, action): GlobalResponse => ({
      ...state,
      list: [...state.list, action.item]
    })
  ),
  on(
    GlobalResponseActions.updateGlobalResponse,
    (state, action): GlobalResponse => ({
      ...state,
      list: [
        ...state.list.map((response) => {
          if (response.id === action.item.id) {
            return action.item;
          }
          return response;
        })
      ]
    })
  ),
  on(
    GlobalResponseActions.resetGlobalResponses,
    (): GlobalResponse => ({
      ...initialState
    })
  )
);
