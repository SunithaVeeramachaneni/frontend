/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';

import { map, catchError, concatMap, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  RoundPlanConfigurationActions,
  RoundPlanConfigurationApiActions
} from './actions';
import { formConfigurationStatus } from 'src/app/app.constants';
import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';

@Injectable()
export class RoundPlanConfigurationEffects {
  constructor(
    private actions$: Actions,
    private operatorRoundsService: OperatorRoundsService
  ) {}

  createRoundPlan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundPlanConfigurationActions.createRoundPlan),
      concatMap((action) =>
        this.operatorRoundsService.createForm$(action.formMetadata).pipe(
          map((response) =>
            RoundPlanConfigurationApiActions.createRoundPlanSuccess({
              formMetadata: {
                id: response.id,
                ...action.formMetadata
              },
              formSaveStatus: formConfigurationStatus.saved
            })
          ),
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

  updateRoundPlan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundPlanConfigurationActions.updateRoundPlan),
      concatMap((action) =>
        this.operatorRoundsService.updateForm$(action).pipe(
          map(() =>
            RoundPlanConfigurationApiActions.updateRoundPlanSuccess({
              formMetadata: {
                ...action.formMetadata
              },
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

  publishRoundPlan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundPlanConfigurationActions.publishRoundPlan),
      concatMap((action) => {
        const { authoredFormDetail, ...formDetail } = action;
        const { hierarchy, subForms } = formDetail;
        return of(true).pipe(
          mergeMap(() =>
            this.operatorRoundsService
              .publishRoundPlan$({
                form: {
                  ...formDetail.formMetadata,
                  formStatus: formConfigurationStatus.published,
                  _version: action.formListDynamoDBVersion
                },
                authoredFormDetail: {
                  ...authoredFormDetail,
                  pages: JSON.stringify(authoredFormDetail.pages),
                  subForms, // Handle subforms form round-plan config,
                  hierarchy
                },
                isEdit:
                  formDetail.formMetadata.formStatus ===
                  formConfigurationStatus.published
              })
              .pipe(
                map((createAuthoredFormDetail) =>
                  RoundPlanConfigurationApiActions.publishRoundPlanSuccess({
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
              RoundPlanConfigurationApiActions.publishRoundPlanFailure({
                error
              })
            );
          })
        );
      })
    )
  );

  createAuthoredRoundPlanDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundPlanConfigurationActions.createAuthoredRoundPlanDetail),
      concatMap((action) =>
        this.operatorRoundsService.createAuthoredFormDetail$(action).pipe(
          map((authoredFormDetail: any) =>
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

  updateAuthoredRoundPlanDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundPlanConfigurationActions.updateAuthoredRoundPlanDetail),
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
