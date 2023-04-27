import { Injectable } from '@angular/core';
import { RaceDynamicFormService } from './rdf.service';
import { Store } from '@ngrx/store';
import { State } from 'src/app/forms/state';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FormConfigurationState } from 'src/app/forms/state/form-configuration.reducer';
import { BuilderConfigurationActions } from 'src/app/forms/state/actions';
import { map } from 'rxjs/operators';
import { formConfigurationStatus } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class TemplateResolverService {
  constructor(
    private raceDynamicFormService: RaceDynamicFormService,
    private store: Store<State>
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<FormConfigurationState> {
    const id = route.params.id;
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
