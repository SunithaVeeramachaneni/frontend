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
          map((response) =>
            RoundPlanConfigurationApiActions.createRoundPlanSuccess({
              formMetadata: { id: response.id, ...action.formMetadata },
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
