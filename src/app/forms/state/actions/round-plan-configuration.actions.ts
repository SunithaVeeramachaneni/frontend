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

export const createRoundPlanDetail = createAction(
  '[RoundPlan Configuration] createRoundPlanDetail',
  props<{
    formMetadata: FormMetadata;
    pages: Page[];
    hierarchy: any;
    subForms: any;
    formListId: string;
    authoredFormDetail: any;
    formListDynamoDBVersion: number;
  }>()
);

export const updateRoundPlanDetail = createAction(
  '[RoundPlan Configuration] updateRoundPlanDetail',
  props<{
    formMetadata: FormMetadata;
    pages: Page[];
    hierarchy: any;
    subForms: any;
    formListId: string;
    formDetailId: string;
    authoredFormDetail: any;
    formDetailDynamoDBVersion: number;
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
    subForms: any;
    formListId: string;
    authoredFormDetailVersion: number;
    hierarchy: any;
  }>()
);

export const updateAuthoredRoundPlanDetail = createAction(
  '[RoundPlan Configuration] updateAuthoredRoundPlanDetail',
  props<{
    formStatus: string;
    formDetailPublishStatus: string;
    counter: number;
    pages: Page[];
    subForms: any;
    formListId: string;
    authoredFormDetailId: string;
    authoredFormDetailDynamoDBVersion: number;
    hierarchy: any;
  }>()
);
