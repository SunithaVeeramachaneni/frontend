/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DEFAULT_PDF_BUILDER_CONFIG,
  graphQLDefaultMaxLimit
} from 'src/app/app.constants';
import { State } from 'src/app/forms/state';

import {
  BuilderConfigurationActions,
  GlobalResponseActions,
  QuickResponseActions,
  UnitOfMeasurementActions
} from 'src/app/forms/state/actions';
import { HierarchyState } from 'src/app/forms/state/hierarchy.reducer';
import { OperatorRoundsService } from './operator-rounds.service';
import { FormConfigurationState } from 'src/app/forms/state/builder/builder.reducer';

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
    if (id === undefined) {
      this.getResponseTypeDetails();
      return of({
        formConfigurationState: {} as FormConfigurationState,
        hierarchyState: {} as HierarchyState
      });
    }
    this.store.dispatch(BuilderConfigurationActions.resetFormConfiguration());
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
          plantId,
          plant,
          instructions,
          lastModifiedBy,
          additionalDetails,
          _version: formListDynamoDBVersion
        } = form;
        let pdfTemplateConfiguration = JSON.parse(
          form?.pdfTemplateConfiguration
        );
        if (!pdfTemplateConfiguration) {
          pdfTemplateConfiguration = DEFAULT_PDF_BUILDER_CONFIG;
        }
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
        if (instructions) {
          const { notes, attachments, pdfDocs } = JSON.parse(instructions);
          const attachmentPromises =
            attachments?.map((attachmentId) =>
              this.operatorRoundsService
                .getAttachmentsById$(attachmentId)
                .toPromise()
                .then()
            ) || [];
          const pdfPromises =
            pdfDocs?.map((pdfId) =>
              this.operatorRoundsService
                .getAttachmentsById$(pdfId)
                .toPromise()
                .then()
            ) || [];
          Promise.all(attachmentPromises).then((result) => {
            this.operatorRoundsService.attachmentsMapping$.next(result);
          });
          Promise.all(pdfPromises).then((result) => {
            this.operatorRoundsService.pdfMapping$.next(result);
          });
        }
        const formMetadata = {
          id,
          name,
          description,
          formLogo,
          isPublic,
          formStatus,
          formType,
          tags,
          plantId,
          plant: plant.name,
          pdfTemplateConfiguration,
          additionalDetails: JSON.parse(additionalDetails),
          instructions: JSON.parse(instructions)
        };

        const subFormsMap = subForms ? JSON.parse(subForms) : {};
        this.getResponseTypeDetails(id);

        return {
          formConfigurationState: {
            formMetadata,
            counter,
            pages: pages ? JSON.parse(pages) : [],
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
    );
  }

  getResponseTypeDetails(id: string = '') {
    if (id) {
      this.store.dispatch(
        QuickResponseActions.fetchFormSpecificQuickResponses({ formId: id })
      );
    }
    this.store.dispatch(
      UnitOfMeasurementActions.fetchUnitOfMeasurementList({
        queryParams: {}
      })
    );
    this.store.dispatch(QuickResponseActions.fetchDefaultQuickResponses());
    this.store.dispatch(GlobalResponseActions.fetchGlobalResponses());
  }
}
