/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';

import { map, catchError, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  FormConfigurationActions,
  FormConfigurationApiActions
} from './actions';

@Injectable()
export class FormConfigurationEffects {
  constructor(private actions$: Actions) {}

  createForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormConfigurationActions.createForm),
      concatMap((action) =>
        of(action.formMetadata).pipe(
          map((formMetadata) =>
            FormConfigurationApiActions.createFormSuccess({ formMetadata })
          ),
          catchError((error) =>
            of(FormConfigurationApiActions.createFormFailure({ error }))
          )
        )
      )
    )
  );

  updateForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormConfigurationActions.updateForm),
      concatMap((action) =>
        of(action.formMetadata).pipe(
          map((formMetadata) =>
            FormConfigurationApiActions.updateFormSuccess({ formMetadata })
          ),
          catchError((error) =>
            of(FormConfigurationApiActions.updateFormFailure({ error }))
          )
        )
      )
    )
  );

  createAuthoredFormDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormConfigurationActions.createAuthoredFormDetail),
      concatMap((action) =>
        of(action.pages).pipe(
          map((pages) =>
            FormConfigurationApiActions.createAuthoredFromDetailSuccess({
              pages
            })
          ),
          catchError((error) =>
            of(
              FormConfigurationApiActions.createAuthoredFromDetailFailure({
                error
              })
            )
          )
        )
      )
    )
  );

  updateAuthoredFormDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormConfigurationActions.updateAuthoredFormDetail),
      concatMap((action) =>
        of(action.pages).pipe(
          map((pages) =>
            FormConfigurationApiActions.updateAuthoredFromDetailSuccess({
              pages
            })
          ),
          catchError((error) =>
            of(
              FormConfigurationApiActions.updateAuthoredFromDetailFailure({
                error
              })
            )
          )
        )
      )
    )
  );
}
