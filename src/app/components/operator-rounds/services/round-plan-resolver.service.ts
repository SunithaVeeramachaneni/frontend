/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { OPRState, State } from 'src/app/forms/state';

import {
  FormConfigurationActions,
  RoundPlanConfigurationActions
} from 'src/app/forms/state/actions';
import { RoundPlanConfigurationState } from 'src/app/forms/state/round-plan-configuration.reducer';
// import { State } from 'src/app/state/app.state';
import { OperatorRoundsService } from './operator-rounds.service';

@Injectable({ providedIn: 'root' })
export class RoundPlanResolverService
  implements Resolve<RoundPlanConfigurationState>
{
  constructor(
    private operatorRoundsService: OperatorRoundsService,
    private store: Store<OPRState>
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<RoundPlanConfigurationState> {
    const id = route.params.id;
    return forkJoin({
      form: this.operatorRoundsService.getFormById$(id),
      authoredFormDetail:
        this.operatorRoundsService.getAuthoredFormDetailByFormId$(id),
      formDetail: this.operatorRoundsService.getFormDetailByFormId$(id)
    }).pipe(
      map(({ form, authoredFormDetail, formDetail }) => {
        this.store.dispatch(
          FormConfigurationActions.updateCreateOrEditForm({
            createOrEditForm: true
          })
        );
        const {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          id,
          name,
          description,
          formLogo,
          isPublic,
          formStatus,
          formType,
          tags,
          _version: formListDynamoDBVersion
        } = form;
        const {
          id: authoredFormDetailId,
          counter,
          pages,
          formDetailPublishStatus,
          version: authoredFormDetailVersion,
          _version: authoredFormDetailDynamoDBVersion
        } = authoredFormDetail;
        const { id: formDetailId, _version: formDetailDynamoDBVersion } =
          formDetail[0] ?? {};
        const formMetadata = {
          id,
          name,
          description,
          formLogo,
          isPublic,
          formStatus,
          formType,
          tags
        };
        return {
          formMetadata,
          counter,
          pages: JSON.parse(pages),
          authoredFormDetailId,
          formDetailId,
          authoredFormDetailVersion: parseInt(authoredFormDetailVersion, 10),
          createOrEditForm: true,
          formStatus: formDetailPublishStatus,
          formDetailPublishStatus,
          formListDynamoDBVersion,
          authoredFormDetailDynamoDBVersion,
          formDetailDynamoDBVersion
        } as RoundPlanConfigurationState;
      }),
      catchError((error) => {
        this.operatorRoundsService.handleError(error);
        return of({} as RoundPlanConfigurationState);
      })
    );
  }
}
