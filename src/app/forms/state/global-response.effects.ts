/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';

import { map, concatMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { GlobalResponseActions } from './actions';
import { ResponseSetService } from 'src/app/components/master-configurations/response-set/services/response-set.service';

@Injectable()
export class GlobalResponseEffects {
  constructor(
    private actions$: Actions,
    private responseSetService: ResponseSetService
  ) {}

  fetchGlobalResponseSet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GlobalResponseActions.fetchGlobalResponses),
      concatMap(() =>
        this.responseSetService.fetchAllGlobalResponses$().pipe(
          map(({ items: list = [] }) =>
            GlobalResponseActions.setGlobalResponses({
              list
            })
          )
        )
      )
    )
  );
}
