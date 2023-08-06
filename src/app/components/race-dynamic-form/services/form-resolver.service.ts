/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DEFAULT_PDF_BUILDER_CONFIG } from 'src/app/app.constants';
import { State } from 'src/app/forms/state';
import { BuilderConfigurationActions } from 'src/app/forms/state/actions';
import { RaceDynamicFormService } from '../../race-dynamic-form/services/rdf.service';
import { RoundPlanResolverService } from '../../operator-rounds/services/round-plan-resolver.service';
import { FormConfigurationState } from 'src/app/forms/state/builder/builder.reducer';

@Injectable({ providedIn: 'root' })
export class FormResolverService implements Resolve<FormConfigurationState> {
  constructor(
    private raceDynamicFormService: RaceDynamicFormService,
    private roundPlanResolverServive: RoundPlanResolverService,
    private store: Store<State>
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<FormConfigurationState> {
    const id = route.params.id;
    console.log(route.params);
    if (id === undefined) {
      this.roundPlanResolverServive.getResponseTypeDetails();
      return of({} as FormConfigurationState);
    }
    this.store.dispatch(BuilderConfigurationActions.resetFormConfiguration());
    return forkJoin({
      form: this.raceDynamicFormService.getFormById$(id, {
        includeAttachments: true
      }),
      embeddedFormDetail: this.raceDynamicFormService.getEmbeddedFormId$(id),
      authoredFormDetail:
        this.raceDynamicFormService.getAuthoredFormDetailByFormId$(id),
      formDetail: this.raceDynamicFormService.getFormDetailByFormId$(id)
    }).pipe(
      map(({ form, embeddedFormDetail, authoredFormDetail, formDetail }) => {
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
          additionalDetails,
          instructions,
          lastModifiedBy,
          _version: formListDynamoDBVersion
        } = form;
        let pdfTemplateConfiguration = JSON.parse(
          form?.pdfTemplateConfiguration
        );
        let embeddedFormId;
        if (embeddedFormDetail) {
          embeddedFormId = embeddedFormDetail.embeddedFormId;
        }
        if (!pdfTemplateConfiguration) {
          pdfTemplateConfiguration = DEFAULT_PDF_BUILDER_CONFIG;
        }
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
        if (instructions) {
          const { notes, attachments, pdfDocs } = JSON.parse(instructions);
          const attachmentPromises =
            attachments?.map((attachmentId) =>
              this.raceDynamicFormService
                .getAttachmentsById$(attachmentId)
                .toPromise()
                .then()
            ) || [];
          const pdfPromises =
            pdfDocs?.map((pdfId) =>
              this.raceDynamicFormService
                .getAttachmentsById$(pdfId)
                .toPromise()
                .then()
            ) || [];
          Promise.all(attachmentPromises).then((result) => {
            this.raceDynamicFormService.attachmentsMapping$.next(result);
          });
          Promise.all(pdfPromises).then((result) => {
            this.raceDynamicFormService.pdfMapping$.next(result);
          });
        }

        const formMetadata = {
          id,
          name,
          description,
          formLogo,
          isPublic,
          pdfTemplateConfiguration,
          formStatus,
          formType,
          tags,
          plantId,
          additionalDetails: JSON.parse(additionalDetails),
          instructions: JSON.parse(instructions),
          plant: plant.name,
          embeddedFormId: embeddedFormId ? embeddedFormId : ''
        };
        this.roundPlanResolverServive.getResponseTypeDetails(id);

        return {
          formMetadata,
          counter,
          pages: pages ? JSON.parse(pages) : [],
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
      })
    );
  }
}
