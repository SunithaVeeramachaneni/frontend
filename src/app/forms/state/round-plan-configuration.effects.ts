/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';

import { map, catchError, concatMap, mergeMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  RoundPlanConfigurationActions,
  RoundPlanConfigurationApiActions
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
      ofType(RoundPlanConfigurationActions.createForm),
      concatMap((action) =>
        this.operatorRoundsService.createForm$(action.formMetadata).pipe(
          map((response) => {
            this.operatorRoundsService.setFormCreatedUpdated(response);
            return RoundPlanConfigurationApiActions.createFormSuccess({
              formMetadata: { id: response.id, ...action.formMetadata },
              formSaveStatus: formConfigurationStatus.saved
            });
          }),
          catchError((error) => {
            this.operatorRoundsService.handleError(error);
            return of(
              RoundPlanConfigurationApiActions.createFormFailure({ error })
            );
          })
        )
      )
    )
  );

  updateForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundPlanConfigurationActions.updateForm),
      concatMap((action) =>
        this.operatorRoundsService.updateForm$(action).pipe(
          map(() =>
            RoundPlanConfigurationApiActions.updateFormSuccess({
              formMetadata: action.formMetadata,
              formSaveStatus: formConfigurationStatus.saved
            })
          ),
          catchError((error) => {
            this.operatorRoundsService.handleError(error);
            return of(
              RoundPlanConfigurationApiActions.updateFormFailure({ error })
            );
          })
        )
      )
    )
  );

  createFormDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundPlanConfigurationActions.createFormDetail),
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
                RoundPlanConfigurationApiActions.createFormDetailSuccess({
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
              RoundPlanConfigurationApiActions.createFormDetailFailure({
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
      ofType(RoundPlanConfigurationActions.updateFormDetail),
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
                RoundPlanConfigurationApiActions.updateFormDetailSuccess({
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
              RoundPlanConfigurationApiActions.updateFormDetailFailure({
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
      ofType(RoundPlanConfigurationActions.createAuthoredFormDetail),
      concatMap((action) =>
        this.operatorRoundsService.createAuthoredFormDetail$(action).pipe(
          map((authoredFormDetail) =>
            RoundPlanConfigurationApiActions.createAuthoredFromDetailSuccess({
              authoredFormDetail,
              formSaveStatus: formConfigurationStatus.saved,
              isFormCreated: true
            })
          ),
          catchError((error) => {
            this.operatorRoundsService.handleError(error);
            return of(
              RoundPlanConfigurationApiActions.createAuthoredFromDetailFailure({
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
      ofType(RoundPlanConfigurationActions.updateAuthoredFormDetail),
      concatMap((action) =>
        this.operatorRoundsService.updateAuthoredFormDetail$(action).pipe(
          map((authoredFormDetail) =>
            RoundPlanConfigurationApiActions.updateAuthoredFromDetailSuccess({
              authoredFormDetail,
              formSaveStatus: formConfigurationStatus.saved
            })
          ),
          catchError((error) => {
            this.operatorRoundsService.handleError(error);
            return of(
              RoundPlanConfigurationApiActions.updateAuthoredFromDetailFailure({
                error
              })
            );
          })
        )
      )
    )
  );
}
