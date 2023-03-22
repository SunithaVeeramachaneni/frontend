import { createAction, props } from '@ngrx/store';

export const getResponseSet = createAction(
  '[Response Set] getResponseSet',
  props<{
    responseType: string;
  }>()
);

export const createGlobalResponseSet = createAction(
  '[Response Set] createGlobalResponseSet',
  props<{
    responseType: string;
    name: string;
    description: string;
    isMultiColumn: boolean;
    values: string;
    createdBy: string;
  }>()
);

export const updateGlobalResponseSet = createAction(
  '[Response Set] updateGlobalResponseSet',
  props<{
    id: string;
    responseType: string;
    name: string;
    description: string | null;
    isMultiColumn: boolean;
    values: string;
    version: number;
    createdBy: string;
  }>()
);

export const deleteGlobalResponseSet = createAction(
  '[Response Set] deleteGlobalResponseSet',
  props<{
    id: string;
  }>()
);
