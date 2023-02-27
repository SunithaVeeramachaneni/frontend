import { createReducer, on } from '@ngrx/store';
import { HierarchyEntity } from 'src/app/interfaces';
import { HierarchyActions } from './actions';

import { deleteNodeFromHierarchy } from 'src/app/shared/utils/assetHierarchyUtil';

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
      selectedHierarchy: [
        ...state.selectedHierarchy,
        ...action.selectedHierarchy
      ]
    })
  ),
  on(
    HierarchyActions.deleteNodeFromSelectedHierarchy,
    (state, action): HierarchyState => {
      const { id } = action;
      const selectedHierarchy = deleteNodeFromHierarchy(
        state.selectedHierarchy,
        id
      );
      console.log(selectedHierarchy);
      return {
        ...state,
        selectedHierarchy
      };
    }
  )
);
