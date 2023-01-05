import { createAction, props } from '@ngrx/store';
import { FormMetadata, Page } from 'src/app/interfaces';

export const createFormSuccess = createAction(
  '[Form Configuration Service] createFormSuccess',
  props<{ formMetaData: FormMetadata }>()
);

export const createFormFailure = createAction(
  '[Form Configuration Service] createFormFailure',
  props<{ error: string }>()
);

export const updateFormSuccess = createAction(
  '[Form Configuration Service] updateFormSuccess',
  props<{ formMetadata: any }>()
);

export const updateFormFailure = createAction(
  '[Form Configuration Service] updateFormFailure',
  props<{ error: string }>()
);

export const createAuthoredFromDetailSuccess = createAction(
  '[Form Configuration Service] createAuthoredFromDetailSuccess',
  props<{ authoredFormDetail: any }>()
);

export const createAuthoredFromDetailFailure = createAction(
  '[Form Configuration Service] createAuthoredFromDetailFailure',
  props<{ error: string }>()
);

export const updateAuthoredFromDetailSuccess = createAction(
  '[Form Configuration Service] updateAuthoredFromDetailSuccess',
  props<{ pages: Page[] }>()
);

export const updateAuthoredFromDetailFailure = createAction(
  '[Form Configuration Service] updateAuthoredFromDetailFailure',
  props<{ error: string }>()
);
