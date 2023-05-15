import { createAction, props } from '@ngrx/store';
import { FormMetadata } from 'src/app/interfaces';
import {
  CreateFormDetail,
  UpdateAuthoredFormDetail,
  UpdateFormDetail
} from 'src/app/interfaces/master-data-management/forms';
import { CreateAuthoredRoundPlanDetail } from 'src/app/interfaces/master-data-management/round-plan';

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
    formDetail: CreateFormDetail;
    authoredFormDetail: CreateAuthoredRoundPlanDetail;
    formStatus: string;
    isPublished: boolean;
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
    formDetail: UpdateFormDetail;
    authoredFormDetail: CreateAuthoredRoundPlanDetail;
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
    authoredFormDetail: CreateAuthoredRoundPlanDetail;
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
    authoredFormDetail: UpdateAuthoredFormDetail;
    formSaveStatus: string;
  }>()
);

export const updateAuthoredFromDetailFailure = createAction(
  '[Form Configuration API] updateAuthoredFromDetailFailure',
  props<{ error: string }>()
);
