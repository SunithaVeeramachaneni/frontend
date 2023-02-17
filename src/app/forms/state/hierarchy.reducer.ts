import { createReducer, on } from '@ngrx/store';
import { HierarchyEntity } from 'src/app/interfaces';
import { HierarchyActions } from './actions';

export interface HierarchyState {
  masterHierarchy: HierarchyEntity[];
}

const initialState = {
  masterHierarchy: [] as HierarchyEntity[]
};

export const hierarchyReducer = createReducer<HierarchyState>(
  initialState,
  on(
    HierarchyActions.setMasterHierarchyList,
    (state, action): HierarchyState => {
      console.log(action);
      return {
        ...state,
        masterHierarchy: action.masterHierarchy
      };
    }
  )
);
