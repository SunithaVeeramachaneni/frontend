import { createAction, props } from '@ngrx/store';
import { HierarchyEntity } from 'src/app/interfaces';

export const setMasterHierarchyList = createAction(
  '[Asset Hierarchy] setMasterHierarchyList',
  props<{
    masterHierarchy: HierarchyEntity[];
  }>()
);
