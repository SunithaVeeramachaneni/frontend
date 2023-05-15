import { createAction, props } from '@ngrx/store';
import { UnitOfMeasurement } from 'src/app/interfaces';

export const fetchUnitOfMeasurementList = createAction(
  '[Unit of Measurement] fetchUnitOfMeasurementList',
  props<{ queryParams: any }>()
);

export const setUnitOfMeasurementList = createAction(
  '[Unit of Measurement] setUnitOfMeasurementList',
  props<{ list: UnitOfMeasurement[] }>()
);

export const resetUnitOfMeasurementList = createAction(
  '[Unit of Measurement] resetUnitOfMeasurementList'
);
