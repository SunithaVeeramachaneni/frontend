import { createReducer, on } from '@ngrx/store';
import { HierarchyEntity } from 'src/app/interfaces';
import { HierarchyActions } from './actions';

import {
  copyNodeToRoutePlan,
  deleteNodeFromHierarchy
} from 'src/app/shared/utils/assetHierarchyUtil';

export interface HierarchyState {
  masterHierarchy: HierarchyEntity[];
  selectedHierarchy: HierarchyEntity[];
}

const initialState = {
  masterHierarchy: [] as HierarchyEntity[],
  selectedHierarchy: [] as HierarchyEntity[]
};

export const hierarchyReducer = createReducer<HierarchyState>(
  initialState,
  on(
    HierarchyActions.setMasterHierarchyList,
    (state, action): HierarchyState => ({
      ...state,
      masterHierarchy: action.masterHierarchy
    })
  ),
  on(
    HierarchyActions.updateSelectedHierarchyList,
    (state, action): HierarchyState => ({
      ...state,
      selectedHierarchy: action.selectedHierarchy
    })
  ),
  on(
    HierarchyActions.copyNodeToRoutePlan,
    (state, action): HierarchyState => ({
      ...state,
      selectedHierarchy: copyNodeToRoutePlan(
        action.node,
        state.selectedHierarchy
      )
    })
  ),
  on(
    HierarchyActions.deleteNodeFromSelectedHierarchy,
    (state, action): HierarchyState => {
      const { instanceIds } = action;
      const selectedHierarchy = deleteNodeFromHierarchy(
        state.selectedHierarchy,
        instanceIds,
        state.selectedHierarchy
      );
      return {
        ...state,
        selectedHierarchy
      };
    }
  ),
  on(
    HierarchyActions.resetSelectedHierarchyState,
    (state, action): HierarchyState => ({
      ...state,
      selectedHierarchy: [] as HierarchyEntity[],
      masterHierarchy: [] as HierarchyEntity[]
    })
  )
);
