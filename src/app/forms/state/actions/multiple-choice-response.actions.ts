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
    refCount: number;
    isMultiColumn: boolean;
    values: string;
  }>()
);

export const updateGlobalResponseSet = createAction(
  '[Response Set] updateGlobalResponseSet',
  props<{
    id: string;
    responseType: string;
    name: string;
    description: string;
    refCount: number;
    isMultiColumn: boolean;
    values: string;
    createdBy: string;
    version: number;
  }>()
);

export const deleteGlobalResponseSet = createAction(
  '[Response Set] deleteGlobalResponseSet',
  props<{
    id: string;
    _version: number;
  }>()
);
