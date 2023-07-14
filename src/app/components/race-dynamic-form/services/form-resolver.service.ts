/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DEFAULT_PDF_BUILDER_CONFIG } from 'src/app/app.constants';
import { State } from 'src/app/forms/state';
import { FormConfigurationActions } from 'src/app/forms/state/actions';
import { FormConfigurationState } from 'src/app/forms/state/form-configuration.reducer';
import { RaceDynamicFormService } from '../../race-dynamic-form/services/rdf.service';
import { RoundPlanResolverService } from '../../operator-rounds/services/round-plan-resolver.service';

@Injectable({ providedIn: 'root' })
export class FormResolverService implements Resolve<FormConfigurationState> {
  constructor(
    private raceDynamicFormService: RaceDynamicFormService,
    private roundPlanResolverServive: RoundPlanResolverService,
    private store: Store<State>
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<FormConfigurationState> {
    const id = route.params.id;
    if (id === undefined) {
      this.roundPlanResolverServive.getResponseTypeDetails();
      return of({} as FormConfigurationState);
    }
    return forkJoin({
      form: this.raceDynamicFormService.getFormById$(id),
      authoredFormDetail:
        this.raceDynamicFormService.getAuthoredFormDetailByFormId$(id),
      formDetail: this.raceDynamicFormService.getFormDetailByFormId$(id)
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
          plantId,
          plant,
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
          pdfTemplateConfiguration,
          formStatus,
          formType,
          tags,
          plantId,
          plant: plant.name
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
