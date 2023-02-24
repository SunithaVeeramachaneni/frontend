import { createAction, props } from '@ngrx/store';
import { FormMetadata, Page } from 'src/app/interfaces';

export const createRoundPlan = createAction(
  '[RoundPlan Configuration Modal Component] createRoundPlan',
  props<{ formMetadata: FormMetadata }>()
);

export const updateRoundPlan = createAction(
  '[RoundPlan Configuration] updateRoundPlan',
  props<{ formMetadata: FormMetadata; formListDynamoDBVersion: number }>()
);

export const publishRoundPlan = createAction(
  '[RoundPlan Configuration] publishRoundPlan',
  props<{
    formMetadata: FormMetadata;
    pages: Page[];
    formListId: string;
    authoredFormDetail: any;
    formListDynamoDBVersion: number;
  }>()
);

export const createAuthoredRoundPlanDetail = createAction(
  '[RoundPlan Configuration] createAuthoredRoundPlanDetail',
  props<{
    formStatus: string;
    formDetailPublishStatus: string;
    counter: number;
    pages: Page[];
    formListId: string;
    authoredFormDetailVersion: number;
  }>()
);

export const updateAuthoredRoundPlanDetail = createAction(
  '[RoundPlan Configuration] updateAuthoredRoundPlanDetail',
  props<{
    formStatus: string;
    formDetailPublishStatus: string;
    counter: number;
    pages: Page[];
    formListId: string;
    authoredFormDetailId: string;
    authoredFormDetailVersion: number;
    authoredFormDetailDynamoDBVersion: number;
  }>()
);
