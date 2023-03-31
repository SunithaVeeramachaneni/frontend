/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';

import { map, catchError, concatMap, mergeMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  BuilderConfigurationActions,
  RoundPlanConfigurationApiActions
} from '../actions';
import { LoginService } from 'src/app/components/login/services/login.service';
import { formConfigurationStatus } from 'src/app/app.constants';
import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';

@Injectable()
export class BuilderConfigurationEffects {
  constructor(
    private actions$: Actions,
    private operatorRoundsService: OperatorRoundsService,
    private loginService: LoginService
  ) {}

  createForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BuilderConfigurationActions.createForm),
      concatMap((action) =>
        this.operatorRoundsService.createForm$(action.formMetadata).pipe(
          map((response) => {
            this.operatorRoundsService.setFormCreatedUpdated(response);
            return RoundPlanConfigurationApiActions.createRoundPlanSuccess({
              formMetadata: { id: response.id, ...action.formMetadata },
              formSaveStatus: formConfigurationStatus.saved
            });
          }),
          catchError((error) => {
            this.operatorRoundsService.handleError(error);
            return of(
              RoundPlanConfigurationApiActions.createRoundPlanFailure({ error })
            );
          })
        )
      )
    )
  );

  updateForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BuilderConfigurationActions.updateForm),
      concatMap((action) =>
        this.operatorRoundsService.updateForm$(action).pipe(
          map(() =>
            RoundPlanConfigurationApiActions.updateRoundPlanSuccess({
              formMetadata: action.formMetadata,
              formSaveStatus: formConfigurationStatus.saved
            })
          ),
          catchError((error) => {
            this.operatorRoundsService.handleError(error);
            return of(
              RoundPlanConfigurationApiActions.updateRoundPlanFailure({ error })
            );
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
        return this.operatorRoundsService.createFormDetail$(formDetail).pipe(
          mergeMap((response) =>
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
                RoundPlanConfigurationApiActions.createRoundPlanDetailSuccess({
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
              RoundPlanConfigurationApiActions.createRoundPlanDetailFailure({
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
                authoredFormDetailVersion:
                  authoredFormDetail.authoredFormDetailVersion + 1
              })
            ]).pipe(
              map(([, , createAuthoredFormDetail]) =>
                RoundPlanConfigurationApiActions.updateRoundPlanDetailSuccess({
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
              RoundPlanConfigurationApiActions.updateRoundPlanDetailFailure({
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
        this.operatorRoundsService.createAuthoredFormDetail$(action).pipe(
          map((authoredFormDetail) =>
            RoundPlanConfigurationApiActions.createAuthoredRoundPlanDetailSuccess(
              {
                authoredFormDetail,
                formSaveStatus: formConfigurationStatus.saved,
                isFormCreated: true
              }
            )
          ),
          catchError((error) => {
            this.operatorRoundsService.handleError(error);
            return of(
              RoundPlanConfigurationApiActions.createAuthoredRoundPlanDetailFailure(
                {
                  error
                }
              )
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
        this.operatorRoundsService.updateAuthoredFormDetail$(action).pipe(
          map((authoredFormDetail) =>
            RoundPlanConfigurationApiActions.updateAuthoredRoundPlanDetailSuccess(
              {
                authoredFormDetail,
                formSaveStatus: formConfigurationStatus.saved
              }
            )
          ),
          catchError((error) => {
            this.operatorRoundsService.handleError(error);
            return of(
              RoundPlanConfigurationApiActions.updateAuthoredRoundPlanDetailFailure(
                {
                  error
                }
              )
            );
          })
        )
      )
    )
  );
}
