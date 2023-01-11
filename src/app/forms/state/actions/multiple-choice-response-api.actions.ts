import { createAction, props } from '@ngrx/store';

export const getResponseSetSuccess = createAction(
  '[Response Set Service] getResponseSetSuccess',
  props<{
    responses: any;
  }>()
);
export const getResponseSetFailure = createAction(
  '[Response Set Service] getResponseSetFailure',
  props<{ error: string }>()
);

export const createResponseSetSuccess = createAction(
  '[Response Set Service] createResponseSetSuccess',
  props<{
    response: any;
  }>()
);

export const createResponseSetFailure = createAction(
  '[Response Set Service] createResponseSetFailure',
  props<{ error: string }>()
);

export const updateResponseSetSuccess = createAction(
  '[Response Set Service] updateResponseSetSuccess',
  props<{
    response: any;
  }>()
);

export const updateResponseSetFailure = createAction(
  '[Response Set Service] updateResponseSetFailure',
  props<{ error: string }>()
);
