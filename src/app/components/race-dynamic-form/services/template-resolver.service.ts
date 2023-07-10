import { Injectable } from '@angular/core';
import { RaceDynamicFormService } from './rdf.service';
import { Store } from '@ngrx/store';
import { State } from 'src/app/forms/state';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BuilderConfigurationActions } from 'src/app/forms/state/actions';
import { map } from 'rxjs/operators';
import { formConfigurationStatus } from 'src/app/app.constants';
import { RoundPlanResolverService } from '../../operator-rounds/services/round-plan-resolver.service';
import { FormConfigurationState } from 'src/app/forms/state/builder/builder.reducer';

@Injectable({
  providedIn: 'root'
})
export class TemplateResolverService {
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
    this.store.dispatch(BuilderConfigurationActions.resetFormConfiguration());
    return this.raceDynamicFormService.fetchTemplateById$(id).pipe(
      map((form) => {
        this.store.dispatch(
          BuilderConfigurationActions.updateCreateOrEditForm({
            createOrEditForm: true
          })
        );

        const {
          name,
          description,
          formLogo,
          isPublic,
          formStatus,
          formType,
          tags,
          authoredFormTemplateDetails
        } = form.rows[0];
        const { counter, pages } = authoredFormTemplateDetails[0];

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
        this.roundPlanResolverServive.getResponseTypeDetails(id);

        return {
          formMetadata,
          counter,
          formStatus,
          pages: JSON.parse(pages),
          formSaveStatus: formConfigurationStatus.saved
        } as FormConfigurationState;
      })
    );
  }
}
