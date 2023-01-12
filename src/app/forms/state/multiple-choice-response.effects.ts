import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, concatMap, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { MCQResponseActions, MCQResponseApiActions } from './actions';

import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';

@Injectable()
export class ResponseSetEffects {
  getResponseSets$ = createEffect(() =>
    this.action$.pipe(
      ofType(MCQResponseActions.getResponseSet),
      concatMap((action) =>
        this.raceDynamicFormService
          .getResponseSet$({ responseType: action.responseType })
          .pipe(
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
        this.raceDynamicFormService.createResponseSet$(action).pipe(
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
        this.raceDynamicFormService.updateResponseSet$(action).pipe(
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
    private raceDynamicFormService: RaceDynamicFormService
  ) {}
}
