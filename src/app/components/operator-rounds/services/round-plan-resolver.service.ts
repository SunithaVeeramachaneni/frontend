/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { State } from 'src/app/forms/state';

import { BuilderConfigurationActions } from 'src/app/forms/state/actions';
import { FormConfigurationState } from 'src/app/forms/state/form-configuration.reducer';
import { HierarchyState } from 'src/app/forms/state/hierarchy.reducer';
import { OperatorRoundsService } from './operator-rounds.service';

@Injectable({ providedIn: 'root' })
export class RoundPlanResolverService
  implements
    Resolve<{
      formConfigurationState: FormConfigurationState;
      hierarchyState: HierarchyState;
    }>
{
  constructor(
    private operatorRoundsService: OperatorRoundsService,
    private store: Store<State>
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<{
    formConfigurationState: FormConfigurationState;
    hierarchyState: HierarchyState;
  }> {
    const id = route.params.id;
    return this.operatorRoundsService.getFormDetailsById$(id).pipe(
      map((response) => {
        if (!Object.keys(response).length) {
          return {
            formConfigurationState: {} as FormConfigurationState,
            hierarchyState: {} as HierarchyState
          };
        }
        const { form, authoredFormDetail, formDetail } = response;
        this.store.dispatch(
          BuilderConfigurationActions.updateCreateOrEditForm({
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
        const pdfBuilderConfiguration = JSON.parse(
          authoredFormDetail?.pdfBuilderConfiguration
        );
        const {
          id: authoredFormDetailId,
          counter,
          pages,
          subForms,
          formDetailPublishStatus,
          version: authoredFormDetailVersion,
          _version: authoredFormDetailDynamoDBVersion,
          hierarchy
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

        const subFormsMap = JSON.parse(subForms);
        return {
          formConfigurationState: {
            formMetadata,
            pdfBuilderConfiguration,
            counter,
            pages: JSON.parse(pages),
            ...subFormsMap,
            authoredFormDetailId,
            formDetailId,
            authoredFormDetailVersion: parseInt(authoredFormDetailVersion, 10),
            createOrEditForm: true,
            formStatus: formDetailPublishStatus,
            formDetailPublishStatus,
            formListDynamoDBVersion,
            authoredFormDetailDynamoDBVersion,
            formDetailDynamoDBVersion
          } as FormConfigurationState,
          hierarchyState: {
            masterHierarchy: [],
            selectedHierarchy: hierarchy ? JSON.parse(hierarchy) : []
          } as HierarchyState
        };
      })
      // catchError((error) => {
      //   this.operatorRoundsService.handleError(error);
      //   return of({
      //     formConfigurationState: {} as FormConfigurationState,
      //     hierarchyState: {} as HierarchyState
      //   });
      // })
    );
  }
}
