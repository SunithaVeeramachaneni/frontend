/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { State } from 'src/app/forms/state';
import { FormConfigurationActions } from 'src/app/forms/state/actions';
import { FormConfigurationState } from 'src/app/forms/state/form-configuration.reducer';
import { RaceDynamicFormService } from '../../race-dynamic-form/services/rdf.service';

@Injectable({ providedIn: 'root' })
export class FormResolverService implements Resolve<FormConfigurationState> {
  constructor(
    private raceDynamicFormService: RaceDynamicFormService,
    private store: Store<State>
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<FormConfigurationState> {
    const id = route.params.id;
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
          _version: formListDynamoDBVersion
        } = form;
        const pdfBuilderConfiguration = JSON.parse(
          authoredFormDetail?.pdfBuilderConfiguration
        );
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
          pdfBuilderConfiguration,
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
        this.raceDynamicFormService.handleError(error);
        return of({} as FormConfigurationState);
      })
    );
  }
}
