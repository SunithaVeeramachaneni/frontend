/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';

import { map, concatMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { UnitOfMeasurementActions } from './actions';
import { UnitMeasurementService } from 'src/app/components/master-configurations/unit-measurement/services';

@Injectable()
export class UnitOfMeasurementEffects {
  constructor(
    private actions$: Actions,
    private unitMeasurementService: UnitMeasurementService
  ) {}

  fetchUnitOfMeasurementList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitOfMeasurementActions.fetchUnitOfMeasurementList),
      concatMap((action) =>
        this.unitMeasurementService
          .getUnitOfMeasurementList$(action.queryParams)
          .pipe(
            map(({ rows: list }) =>
              UnitOfMeasurementActions.setUnitOfMeasurementList({
                list
              })
            )
          )
      )
    )
  );
}
