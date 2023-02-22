/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { State } from 'src/app/forms/state';

import { FormConfigurationActions } from 'src/app/forms/state/actions';
import { FormConfigurationState } from 'src/app/forms/state/form-configuration.reducer';
import { OperatorRoundsService } from './operator-rounds.service';

@Injectable({ providedIn: 'root' })
export class RoundPlanResolverService
  implements Resolve<FormConfigurationState>
{
  constructor(
    private operatorRoundsService: OperatorRoundsService,
    private store: Store<State>
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<FormConfigurationState> {
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
        } as FormConfigurationState;
      }),
      catchError((error) => {
        this.operatorRoundsService.handleError(error);
        return of({} as FormConfigurationState);
      })
    );
  }
}
