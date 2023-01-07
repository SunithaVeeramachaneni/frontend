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
              formMetadata: { id: response.id, ...action.formMetadata }
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

  createFormDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormConfigurationActions.createFormDetail),
      concatMap((action) =>
        this.raceDynamicFormService.createFormDetail$(action).pipe(
          map((formDetail) =>
            FormConfigurationApiActions.createFormDetailSuccess({
              formDetail
            })
          ),
          catchError((error) =>
            of(
              FormConfigurationApiActions.createFormDetailFailure({
                error
              })
            )
          )
        )
      )
    )
  );

  updateFormDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormConfigurationActions.updateFormDetail),
      concatMap((action) =>
        this.raceDynamicFormService.updateFormDetail$(action).pipe(
          map((formDetail) =>
            FormConfigurationApiActions.updateFormDetailSuccess({
              formDetail
            })
          ),
          catchError((error) =>
            of(
              FormConfigurationApiActions.updateFormDetailFailure({
                error
              })
            )
          )
        )
      )
    )
  );

  createAuthoredFormDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormConfigurationActions.createAuthoredFormDetail),
      concatMap((action) =>
        this.raceDynamicFormService.createAuthoredFormDetail$(action).pipe(
          map((authoredFormDetail) =>
            FormConfigurationApiActions.createAuthoredFromDetailSuccess({
              authoredFormDetail,
              formSaveStatus: 'Saved'
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
        this.raceDynamicFormService.updateAuthoredFormDetail$(action).pipe(
          map((authoredFormDetail) =>
            FormConfigurationApiActions.updateAuthoredFromDetailSuccess({
              authoredFormDetail,
              formSaveStatus: 'Saved'
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
