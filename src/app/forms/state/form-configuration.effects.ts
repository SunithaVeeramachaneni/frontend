/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';

import { map, catchError, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  FormConfigurationActions,
  FormConfigurationApiActions
} from './actions';
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';

@Injectable()
export class FormConfigurationEffects {
  constructor(
    private actions$: Actions,
    private raceDynamicFormService: RaceDynamicFormService
  ) {}

  createForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormConfigurationActions.createForm),
      concatMap((action) =>
        this.raceDynamicFormService.createForm$(action.formMetadata).pipe(
          map((response) =>
            FormConfigurationApiActions.createFormSuccess({
              formMetaData: { id: response.id, ...action.formMetadata }
            })
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
        this.raceDynamicFormService.updateForm$(action.formMetadata).pipe(
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
        this.raceDynamicFormService
          .createAuthoredFormDetail$(action.formDetails)
          .pipe(
            map((response) =>
              FormConfigurationApiActions.createAuthoredFromDetailSuccess({
                authoredFormDetail: response
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
