import { createAction, props } from '@ngrx/store';
import { HierarchyEntity } from 'src/app/interfaces';

export const setMasterHierarchyList = createAction(
  '[Asset Hierarchy] setMasterHierarchyList',
  props<{
    masterHierarchy: HierarchyEntity[];
  }>()
);

export const updateSelectedHierarchyList = createAction(
  '[Asset Hierarchy] updateSelectedHierarchyList',
  props<{
    selectedHierarchy: HierarchyEntity[];
  }>()
);

export const deleteNodeFromSelectedHierarchy = createAction(
  '[Asset Hierarchy] deleteNodeFromSelectedHierarchy',
  props<{
    instanceIds: string[];
  }>()
);

export const resetSelectedHierarchyState = createAction(
  '[Asset Hierarchy] resetHierarchyState'
);
