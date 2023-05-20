/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';

import { map, concatMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { QuickResponseActions } from './actions';
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';

@Injectable()
export class QuickResponseEffects {
  constructor(
    private actions$: Actions,
    private rdfService: RaceDynamicFormService
  ) {}

  fetchDefaultQuickResponses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuickResponseActions.fetchDefaultQuickResponses),
      concatMap(() =>
        this.rdfService.getDataSetsByType$('quickResponses').pipe(
          map((responses) => {
            const defaultResponses = responses.filter((item) => !item.formId);
            return QuickResponseActions.setDefaultQuickResponses({
              defaultResponses
            });
          })
        )
      )
    )
  );

  fetchFormSpecificQuickResponses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuickResponseActions.fetchFormSpecificQuickResponses),
      concatMap((action) =>
        this.rdfService
          .getDataSetsByFormId$('quickResponses', action.formId)
          .pipe(
            map((formSpecificResponses) =>
              QuickResponseActions.setFormSpecificQuickResponses({
                formSpecificResponses
              })
            )
          )
      )
    )
  );
}
