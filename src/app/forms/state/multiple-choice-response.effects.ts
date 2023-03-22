import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { MCQResponseActions, MCQResponseApiActions } from './actions';

import { ResponseSetService } from 'src/app/components/master-configurations/response-set/services/response-set.service';

@Injectable()
export class ResponseSetEffects {
  getResponseSets$ = createEffect(() =>
    this.action$.pipe(
      ofType(MCQResponseActions.getResponseSet),
      concatMap(() =>
        this.responseSetService.fetchAllGlobalResponses$().pipe(
          map((responses) =>
            MCQResponseApiActions.getResponseSetSuccess({ responses })
          ),
          catchError((error) =>
            of(MCQResponseApiActions.getResponseSetFailure({ error }))
          )
        )
      )
    )
  );

  createResponseSet$ = createEffect(() =>
    this.action$.pipe(
      ofType(MCQResponseActions.createGlobalResponseSet),
      concatMap((action) =>
        this.responseSetService.createResponseSet$(action).pipe(
          map((response) =>
            MCQResponseApiActions.createResponseSetSuccess({ response })
          ),
          catchError((error) =>
            of(MCQResponseApiActions.createResponseSetFailure({ error }))
          )
        )
      )
    )
  );

  updateResponseSet$ = createEffect(() =>
    this.action$.pipe(
      ofType(MCQResponseActions.updateGlobalResponseSet),
      concatMap((action) =>
        this.responseSetService.updateResponseSet$(action).pipe(
          map((response) =>
            MCQResponseApiActions.updateResponseSetSuccess({ response })
          ),
          catchError((error) =>
            of(MCQResponseApiActions.updateResponseSetFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private action$: Actions,
    private responseSetService: ResponseSetService
  ) {}
}
