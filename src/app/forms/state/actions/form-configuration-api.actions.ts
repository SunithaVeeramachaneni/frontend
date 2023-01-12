import { createAction, props } from '@ngrx/store';
import {
  CreateAuthoredFormDetailMutation,
  CreateFormDetailMutation,
  UpdateAuthoredFormDetailMutation,
  UpdateFormDetailMutation
} from 'src/app/API.service';
import { FormMetadata } from 'src/app/interfaces';

export const createFormSuccess = createAction(
  '[Form Configuration API] createFormSuccess',
  props<{ formMetadata: FormMetadata; formSaveStatus: string }>()
);

export const createFormFailure = createAction(
  '[Form Configuration API] createFormFailure',
  props<{ error: string }>()
);

export const updateFormSuccess = createAction(
  '[Form Configuration API] updateFormSuccess',
  props<{ formMetadata: FormMetadata; formSaveStatus: string }>()
);

export const updateFormFailure = createAction(
  '[Form Configuration API] updateFormFailure',
  props<{ error: string }>()
);

export const createFormDetailSuccess = createAction(
  '[Form Configuration API] createFormDetailSuccess',
  props<{
    formDetail: CreateFormDetailMutation;
    authoredFormDetail: CreateAuthoredFormDetailMutation;
    formStatus: string;
    formDetailPublishStatus: string;
  }>()
);

export const createFormDetailFailure = createAction(
  '[Form Configuration API] createFormDetailFailure',
  props<{
    error: string;
  }>()
);

export const updateFormDetailSuccess = createAction(
  '[Form Configuration API] updateFormDetailSuccess',
  props<{
    formDetail: UpdateFormDetailMutation;
    authoredFormDetail: CreateAuthoredFormDetailMutation;
    formStatus: string;
    formDetailPublishStatus: string;
  }>()
);

export const updateFormDetailFailure = createAction(
  '[Form Configuration API] updateFormDetailFailure',
  props<{
    error: string;
  }>()
);

export const createAuthoredFromDetailSuccess = createAction(
  '[Form Configuration API] createAuthoredFromDetailSuccess',
  props<{
    authoredFormDetail: CreateAuthoredFormDetailMutation;
    formSaveStatus: string;
    isFormCreated: boolean;
  }>()
);

export const createAuthoredFromDetailFailure = createAction(
  '[Form Configuration API] createAuthoredFromDetailFailure',
  props<{ error: string }>()
);

export const updateAuthoredFromDetailSuccess = createAction(
  '[Form Configuration API] updateAuthoredFromDetailSuccess',
  props<{
    authoredFormDetail: UpdateAuthoredFormDetailMutation;
    formSaveStatus: string;
  }>()
);

export const updateAuthoredFromDetailFailure = createAction(
  '[Form Configuration API] updateAuthoredFromDetailFailure',
  props<{ error: string }>()
);
