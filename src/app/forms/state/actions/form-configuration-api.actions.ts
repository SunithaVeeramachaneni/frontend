import { createAction, props } from '@ngrx/store';
import {
  CreateAuthoredFormDetailMutation,
  CreateFormDetailMutation,
  UpdateAuthoredFormDetailMutation,
  UpdateFormDetailMutation
} from 'src/app/API.service';
import { FormMetadata } from 'src/app/interfaces';

export const createFormSuccess = createAction(
  '[Form Configuration Service] createFormSuccess',
  props<{ formMetadata: FormMetadata; formSaveStatus: string }>()
);

export const createFormFailure = createAction(
  '[Form Configuration Service] createFormFailure',
  props<{ error: string }>()
);

export const updateFormSuccess = createAction(
  '[Form Configuration Service] updateFormSuccess',
  props<{ formMetadata: FormMetadata; formSaveStatus: string }>()
);

export const updateFormFailure = createAction(
  '[Form Configuration Service] updateFormFailure',
  props<{ error: string }>()
);

export const createFormDetailSuccess = createAction(
  '[Form Configuration Component] createFormDetailSuccess',
  props<{
    formDetail: CreateFormDetailMutation;
    formPublishStatus: string;
  }>()
);

export const createFormDetailFailure = createAction(
  '[Form Configuration Component] createFormDetailFailure',
  props<{
    error: string;
  }>()
);

export const updateFormDetailSuccess = createAction(
  '[Form Configuration Component] updateFormDetailSuccess',
  props<{
    formDetail: UpdateFormDetailMutation;
    formPublishStatus: string;
  }>()
);

export const updateFormDetailFailure = createAction(
  '[Form Configuration Component] updateFormDetailFailure',
  props<{
    error: string;
  }>()
);

export const createAuthoredFromDetailSuccess = createAction(
  '[Form Configuration Service] createAuthoredFromDetailSuccess',
  props<{
    authoredFormDetail: CreateAuthoredFormDetailMutation;
    formSaveStatus: string;
  }>()
);

export const createAuthoredFromDetailFailure = createAction(
  '[Form Configuration Service] createAuthoredFromDetailFailure',
  props<{ error: string }>()
);

export const updateAuthoredFromDetailSuccess = createAction(
  '[Form Configuration Service] updateAuthoredFromDetailSuccess',
  props<{
    authoredFormDetail: UpdateAuthoredFormDetailMutation;
    formSaveStatus: string;
  }>()
);

export const updateAuthoredFromDetailFailure = createAction(
  '[Form Configuration Service] updateAuthoredFromDetailFailure',
  props<{ error: string }>()
);
