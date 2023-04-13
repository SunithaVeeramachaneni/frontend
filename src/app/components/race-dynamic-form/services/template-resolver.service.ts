import { Injectable } from '@angular/core';
import { RaceDynamicFormService } from './rdf.service';
import { Store } from '@ngrx/store';
import { State } from 'src/app/forms/state';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {
  FormConfigurationState,
  TemplateConfigurationState
} from 'src/app/forms/state/form-configuration.reducer';
import { FormConfigurationActions } from 'src/app/forms/state/actions';
import { map } from 'rxjs/operators';

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
          FormConfigurationActions.updateCreateOrEditForm({
            createOrEditForm: true
          })
        );

        const {
          id,
          name,
          description,
          formLogo,
          isPublic,
          formStatus,
          formType,
          tags,
          authoredFormTemplateDetails
        } = form.rows[0];
        const {
          counter,
          pages,
          formDetailPublishStatus,
          version: authoredFormDetailVersion
        } = authoredFormTemplateDetails[0];

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
          authoredFormDetailVersion: parseInt(authoredFormDetailVersion, 10),
          createOrEditForm: true,
          formStatus: formDetailPublishStatus
        } as FormConfigurationState;
      })
    );
  }
}
