import { createAction, props } from '@ngrx/store';
import {
  CreateAuthoredRoundPlanDetailMutation,
  CreateRoundPlanDetailMutation,
  UpdateAuthoredRoundPlanDetailMutation,
  UpdateRoundPlanDetailMutation
} from 'src/app/API.service';
import { FormMetadata } from 'src/app/interfaces';

export const createRoundPlanSuccess = createAction(
  '[Round Plan Configuration API] createRoundPlanSuccess',
  props<{ formMetadata: FormMetadata; formSaveStatus: string }>()
);

export const createRoundPlanFailure = createAction(
  '[Round Plan Configuration API] createRoundPlanFailure',
  props<{ error: string }>()
);

export const updateRoundPlanSuccess = createAction(
  '[Round Plan Configuration API] updateRoundPlanSuccess',
  props<{ formMetadata: FormMetadata; formSaveStatus: string }>()
);

export const updateRoundPlanFailure = createAction(
  '[Round Plan Configuration API] updateRoundPlanFailure',
  props<{ error: string }>()
);

export const createAuthoredRoundPlanDetailSuccess = createAction(
  '[Round Plan Configuration API] createAuthoredRoundPlanDetailSuccess',
  props<{
    authoredFormDetail: CreateAuthoredRoundPlanDetailMutation;
    formSaveStatus: string;
    isFormCreated: boolean;
  }>()
);

export const createAuthoredRoundPlanDetailFailure = createAction(
  '[Round Plan Configuration API] createAuthoredRoundPlanDetailFailure',
  props<{ error: string }>()
);

export const updateAuthoredRoundPlanDetailSuccess = createAction(
  '[Round Plan Configuration API] updateAuthoredRoundPlanDetailSuccess',
  props<{
    authoredFormDetail: UpdateAuthoredRoundPlanDetailMutation;
    formSaveStatus: string;
  }>()
);

export const updateAuthoredRoundPlanDetailFailure = createAction(
  '[Round Plan Configuration API] updateAuthoredRoundPlanDetailFailure',
  props<{ error: string }>()
);

export const publishRoundPlanSuccess = createAction(
  '[Round Plan Configuration API] publishRoundPlanSuccess',
  props<{
    authoredFormDetail: CreateAuthoredRoundPlanDetailMutation;
    formStatus: string;
    formDetailPublishStatus: string;
  }>()
);

export const publishRoundPlanFailure = createAction(
  '[Round Plan Configuration API] publishRoundPlanFailure',
  props<{ error: string }>()
);
