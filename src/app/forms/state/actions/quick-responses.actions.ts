import { createAction, props } from '@ngrx/store';

export const fetchDefaultQuickResponses = createAction(
  '[Quick Responses] fetchDefaultQuickResponses'
);

export const fetchFormSpecificQuickResponses = createAction(
  '[Quick Responses] fetchFormSpecificQuickResponses',
  props<{ formId: string }>()
);

export const setDefaultQuickResponses = createAction(
  '[Quick Responses] setDefaultQuickResponses',
  props<{ defaultResponses: any[] }>()
);

export const setFormSpecificQuickResponses = createAction(
  '[Quick Responses] setFormSpecificQuickResponses',
  props<{ formSpecificResponses: any[] }>()
);

export const setFormSpecificQuickResponse = createAction(
  '[Quick Responses] setFormSpecificQuickResponse',
  props<{ formSpecificResponse: any }>()
);

export const updateFormSpecificQuickResponse = createAction(
  '[Quick Responses] updateFormSpecificQuickResponse',
  props<{ formSpecificResponse: any }>()
);

export const resetQuickResponses = createAction(
  '[Quick Responses] resetQuickResponses'
);

export const addFormSpecificQuickResponses = createAction(
  '[Quick Responses] addFormSpecificQuickResponses',
  props<{ formSpecificResponses: any[] }>()
);
