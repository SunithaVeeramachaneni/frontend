/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';

import { map, catchError, concatMap, mergeMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  FormConfigurationApiActions,
  RoundPlanConfigurationActions
} from './actions';
import { LoginService } from 'src/app/components/login/services/login.service';
import { formConfigurationStatus } from 'src/app/app.constants';
import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';
import { CreateRoundPlanDetailMutation } from 'src/app/API.service';

@Injectable()
export class RoundPlanConfigurationEffects {
  constructor(
    private actions$: Actions,
    private operatorRoundsService: OperatorRoundsService,
    private loginService: LoginService
  ) {}

  createForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundPlanConfigurationActions.createRoundPlan),
      concatMap((action) =>
        this.operatorRoundsService.createForm$(action.formMetadata).pipe(
          map((response) => {
            this.operatorRoundsService.setFormCreatedUpdated(response);
            return FormConfigurationApiActions.createFormSuccess({
              formMetadata: { id: response.id, ...action.formMetadata },
              formSaveStatus: formConfigurationStatus.saved
            });
          }),
          catchError((error) => {
            this.operatorRoundsService.handleError(error);
            return of(FormConfigurationApiActions.createFormFailure({ error }));
          })
        )
      )
    )
  );

  updateForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundPlanConfigurationActions.updateRoundPlan),
      concatMap((action) =>
        this.operatorRoundsService.updateForm$(action).pipe(
          map(() =>
            FormConfigurationApiActions.updateFormSuccess({
              formMetadata: action.formMetadata,
              formSaveStatus: formConfigurationStatus.saved
            })
          ),
          catchError((error) => {
            this.operatorRoundsService.handleError(error);
            return of(FormConfigurationApiActions.updateFormFailure({ error }));
          })
        )
      )
    )
  );

  createFormDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundPlanConfigurationActions.createRoundPlanDetail),
      concatMap((action) => {
        const { authoredFormDetail, ...formDetail } = action;
        return this.operatorRoundsService.createFormDetail$(formDetail).pipe(
          mergeMap((response: CreateRoundPlanDetailMutation) =>
            forkJoin([
              this.operatorRoundsService.updateForm$({
                formMetadata: {
                  ...formDetail.formMetadata,
                  lastPublishedBy: this.loginService.getLoggedInUserName(),
                  publishedDate: new Date().toISOString(),
                  formStatus: formConfigurationStatus.published
                },
                formListDynamoDBVersion: action.formListDynamoDBVersion
              }),
              this.operatorRoundsService.updateAuthoredFormDetail$({
                ...authoredFormDetail,
                formStatus: formConfigurationStatus.published,
                formDetailPublishStatus: formConfigurationStatus.published
              }),
              this.operatorRoundsService.createAuthoredFormDetail$({
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
            this.operatorRoundsService.handleError(error);
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
      ofType(RoundPlanConfigurationActions.updateRoundPlanDetail),
      concatMap((action) => {
        const { authoredFormDetail, ...formDetail } = action;
        return this.operatorRoundsService.updateFormDetail$(formDetail).pipe(
          mergeMap((response) =>
            forkJoin([
              this.operatorRoundsService.updateForm$({
                formMetadata: {
                  ...formDetail.formMetadata,
                  lastPublishedBy: this.loginService.getLoggedInUserName(),
                  publishedDate: new Date().toISOString()
                },
                formListDynamoDBVersion: action.formListDynamoDBVersion
              }),
              this.operatorRoundsService.updateAuthoredFormDetail$({
                ...authoredFormDetail,
                formStatus: formConfigurationStatus.published,
                formDetailPublishStatus: formConfigurationStatus.published
              }),
              this.operatorRoundsService.createAuthoredFormDetail$({
                ...authoredFormDetail,
                formDetailPublishStatus: formConfigurationStatus.published,
                authoredRoundPlanDetailVersion:
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
            this.operatorRoundsService.handleError(error);
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
      ofType(RoundPlanConfigurationActions.createAuthoredRoundPlanDetail),
      concatMap((action) =>
        this.operatorRoundsService.createAuthoredFormDetail$(action).pipe(
          map((authoredFormDetail: any) =>
            FormConfigurationApiActions.createAuthoredFromDetailSuccess({
              authoredFormDetail,
              formSaveStatus: formConfigurationStatus.saved,
              isFormCreated: true
            })
          ),
          catchError((error) => {
            this.operatorRoundsService.handleError(error);
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
      ofType(RoundPlanConfigurationActions.updateAuthoredRoundPlanDetail),
      concatMap((action) =>
        this.operatorRoundsService.updateAuthoredFormDetail$(action).pipe(
          map((authoredFormDetail) =>
            FormConfigurationApiActions.updateAuthoredFromDetailSuccess({
              authoredFormDetail,
              formSaveStatus: formConfigurationStatus.saved
            })
          ),
          catchError((error) => {
            this.operatorRoundsService.handleError(error);
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
