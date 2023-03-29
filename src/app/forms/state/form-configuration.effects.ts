/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';

import { map, catchError, concatMap, mergeMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  BuilderConfigurationActions,
  FormConfigurationApiActions
} from './actions';
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';
import { LoginService } from 'src/app/components/login/services/login.service';
import { formConfigurationStatus } from 'src/app/app.constants';

@Injectable()
export class FormConfigurationEffects {
  constructor(
    private actions$: Actions,
    private raceDynamicFormService: RaceDynamicFormService,
    private loginService: LoginService
  ) {}

  createForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BuilderConfigurationActions.createForm),
      concatMap((action) =>
        this.raceDynamicFormService.createForm$(action.formMetadata).pipe(
          map((response) => {
            this.raceDynamicFormService.setFormCreatedUpdated(response);
            return FormConfigurationApiActions.createFormSuccess({
              formMetadata: { id: response.id, ...action.formMetadata },
              formSaveStatus: formConfigurationStatus.saved
            });
          }),
          catchError((error) => {
            this.raceDynamicFormService.handleError(error);
            return of(FormConfigurationApiActions.createFormFailure({ error }));
          })
        )
      )
    )
  );

  updateForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BuilderConfigurationActions.updateForm),
      concatMap((action) =>
        this.raceDynamicFormService.updateForm$(action).pipe(
          map(() =>
            FormConfigurationApiActions.updateFormSuccess({
              formMetadata: action.formMetadata,
              formSaveStatus: formConfigurationStatus.saved
            })
          ),
          catchError((error) => {
            this.raceDynamicFormService.handleError(error);
            return of(FormConfigurationApiActions.updateFormFailure({ error }));
          })
        )
      )
    )
  );

  createFormDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BuilderConfigurationActions.createFormDetail),
      concatMap((action) => {
        const { authoredFormDetail, ...formDetail } = action;
        return this.raceDynamicFormService.createFormDetail$(formDetail).pipe(
          mergeMap((response) =>
            forkJoin([
              this.raceDynamicFormService.updateForm$({
                formMetadata: {
                  ...formDetail.formMetadata,
                  lastPublishedBy: this.loginService.getLoggedInUserName(),
                  publishedDate: new Date().toISOString(),
                  formStatus: formConfigurationStatus.published
                },
                formListDynamoDBVersion: action.formListDynamoDBVersion
              }),
              this.raceDynamicFormService.updateAuthoredFormDetail$({
                ...authoredFormDetail,
                formStatus: formConfigurationStatus.published,
                formDetailPublishStatus: formConfigurationStatus.published
              }),
              this.raceDynamicFormService.createAuthoredFormDetail$({
                ...authoredFormDetail,
                formDetailPublishStatus: formConfigurationStatus.published,
                authoredFormDetailVersion:
                  authoredFormDetail.authoredFormDetailVersion + 1
              })
            ]).pipe(
              map(([, , createAuthoredFormDetail]) =>
                FormConfigurationApiActions.createFormDetailSuccess({
                  formDetail: response,
                  authoredFormDetail: createAuthoredFormDetail,
                  formStatus: formConfigurationStatus.published,
                  formDetailPublishStatus: formConfigurationStatus.published
                })
              )
            )
          ),
          catchError((error) => {
            this.raceDynamicFormService.handleError(error);
            return of(
              FormConfigurationApiActions.createFormDetailFailure({
                error
              })
            );
          })
        );
      })
    )
  );

  updateFormDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BuilderConfigurationActions.updateFormDetail),
      concatMap((action) => {
        const { authoredFormDetail, ...formDetail } = action;
        return this.raceDynamicFormService.updateFormDetail$(formDetail).pipe(
          mergeMap((response) =>
            forkJoin([
              this.raceDynamicFormService.updateForm$({
                formMetadata: {
                  ...formDetail.formMetadata,
                  lastPublishedBy: this.loginService.getLoggedInUserName(),
                  publishedDate: new Date().toISOString()
                },
                formListDynamoDBVersion: action.formListDynamoDBVersion
              }),
              this.raceDynamicFormService.updateAuthoredFormDetail$({
                ...authoredFormDetail,
                formStatus: formConfigurationStatus.published,
                formDetailPublishStatus: formConfigurationStatus.published
              }),
              this.raceDynamicFormService.createAuthoredFormDetail$({
                ...authoredFormDetail,
                formDetailPublishStatus: formConfigurationStatus.published,
                authoredFormDetailVersion:
                  authoredFormDetail.authoredFormDetailVersion + 1
              })
            ]).pipe(
              map(([, , createAuthoredFormDetail]) =>
                FormConfigurationApiActions.updateFormDetailSuccess({
                  formDetail: response,
                  authoredFormDetail: createAuthoredFormDetail,
                  formStatus: formConfigurationStatus.published,
                  formDetailPublishStatus: formConfigurationStatus.published
                })
              )
            )
          ),
          catchError((error) => {
            this.raceDynamicFormService.handleError(error);
            return of(
              FormConfigurationApiActions.updateFormDetailFailure({
                error
              })
            );
          })
        );
      })
    )
  );

  createAuthoredFormDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BuilderConfigurationActions.createAuthoredFormDetail),
      concatMap((action) =>
        this.raceDynamicFormService.createAuthoredFormDetail$(action).pipe(
          map((authoredFormDetail) =>
            FormConfigurationApiActions.createAuthoredFromDetailSuccess({
              authoredFormDetail,
              formSaveStatus: formConfigurationStatus.saved,
              isFormCreated: true
            })
          ),
          catchError((error) => {
            this.raceDynamicFormService.handleError(error);
            return of(
              FormConfigurationApiActions.createAuthoredFromDetailFailure({
                error
              })
            );
          })
        )
      )
    )
  );

  updateAuthoredFormDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BuilderConfigurationActions.updateAuthoredFormDetail),
      concatMap((action) =>
        this.raceDynamicFormService.updateAuthoredFormDetail$(action).pipe(
          map((authoredFormDetail) =>
            FormConfigurationApiActions.updateAuthoredFromDetailSuccess({
              authoredFormDetail,
              formSaveStatus: formConfigurationStatus.saved
            })
          ),
          catchError((error) => {
            this.raceDynamicFormService.handleError(error);
            return of(
              FormConfigurationApiActions.updateAuthoredFromDetailFailure({
                error
              })
            );
          })
        )
      )
    )
  );
}
