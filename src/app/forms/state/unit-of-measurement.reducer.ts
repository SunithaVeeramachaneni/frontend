import { createReducer, on } from '@ngrx/store';
import { UnitOfMeasurementActions } from './actions';
import { UnitOfMeasurement } from 'src/app/interfaces';

export interface UOM {
  list: UnitOfMeasurement[];
}

const initialState: UOM = {
  list: [] as UnitOfMeasurement[]
};

export const unitOfMeasurementReducer = createReducer<UOM>(
  initialState,
  on(
    UnitOfMeasurementActions.setUnitOfMeasurementList,
    (state, action): UOM => ({
      list: action.list
    })
  ),
  on(
    UnitOfMeasurementActions.resetUnitOfMeasurementList,
    (): UOM => ({
      ...initialState
    })
  )
);
