/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';

import { map, catchError, concatMap, mergeMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  FormConfigurationActions,
  FormConfigurationApiActions
} from './actions';
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';
import { LoginService } from 'src/app/components/login/services/login.service';

@Injectable()
export class FormConfigurationEffects {
  constructor(
    private actions$: Actions,
    private raceDynamicFormService: RaceDynamicFormService,
    private loginService: LoginService
  ) {}

  createForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormConfigurationActions.createForm),
      concatMap((action) =>
        this.raceDynamicFormService.createForm$(action.formMetadata).pipe(
          map((response) =>
            FormConfigurationApiActions.createFormSuccess({
              formMetadata: { id: response.id, ...action.formMetadata },
              formSaveStatus: 'Saved'
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
          map(() =>
            FormConfigurationApiActions.updateFormSuccess({
              formMetadata: action.formMetadata,
              formSaveStatus: 'Saved'
            })
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
      concatMap((action) => {
        const { authoredFormDetail, ...formDetail } = action;
        return this.raceDynamicFormService.createFormDetail$(formDetail).pipe(
          mergeMap((response) =>
            forkJoin([
              this.raceDynamicFormService.updateForm$({
                ...formDetail.formMetadata,
                lastPublishedBy: this.loginService.getLoggedInUserName(),
                publishedDate: new Date().toISOString()
              }),
              this.raceDynamicFormService.createAuthoredFormDetail$({
                ...authoredFormDetail,
                authoredFormDetailVersion:
                  authoredFormDetail.authoredFormDetailVersion + 1
              })
            ]).pipe(
              map(() =>
                FormConfigurationApiActions.createFormDetailSuccess({
                  formDetail: response,
                  formPublishStatus: 'Published'
                })
              )
            )
          ),
          catchError((error) =>
            of(
              FormConfigurationApiActions.createFormDetailFailure({
                error
              })
            )
          )
        );
      })
    )
  );

  updateFormDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormConfigurationActions.updateFormDetail),
      concatMap((action) => {
        const { authoredFormDetail, ...formDetail } = action;
        return this.raceDynamicFormService.updateFormDetail$(formDetail).pipe(
          mergeMap((response) =>
            forkJoin([
              this.raceDynamicFormService.updateForm$({
                ...formDetail.formMetadata,
                lastPublishedBy: this.loginService.getLoggedInUserName(),
                publishedDate: new Date().toISOString()
              }),
              this.raceDynamicFormService.createAuthoredFormDetail$({
                ...authoredFormDetail,
                authoredFormDetailVersion:
                  authoredFormDetail.authoredFormDetailVersion + 1
              })
            ]).pipe(
              map(() =>
                FormConfigurationApiActions.updateFormDetailSuccess({
                  formDetail: response,
                  formPublishStatus: 'Published'
                })
              )
            )
          ),
          catchError((error) =>
            of(
              FormConfigurationApiActions.updateFormDetailFailure({
                error
              })
            )
          )
        );
      })
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
