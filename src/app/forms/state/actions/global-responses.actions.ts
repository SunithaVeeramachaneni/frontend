import { createAction, props } from '@ngrx/store';

export const fetchGlobalResponses = createAction(
  '[Global Responses] fetchGlobalResponses'
);

export const setGlobalResponses = createAction(
  '[Global Responses] setGlobalResponses',
  props<{ list: any[] }>()
);

export const setGlobalResponse = createAction(
  '[Global Responses] setGlobalResponse',
  props<{ item: any }>()
);

export const updateGlobalResponse = createAction(
  '[Global Responses] updateGlobalResponse',
  props<{ item: any }>()
);

export const resetGlobalResponses = createAction(
  '[Global Responses] resetGlobalResponses'
);
