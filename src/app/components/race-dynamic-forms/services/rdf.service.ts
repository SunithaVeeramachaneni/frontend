import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorInfo } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RdfService {
  constructor(private appService: AppService) {}

  createForm$ = (
    form: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._postData(environment.rdfApiUrl, 'forms', form, info);

  updateForm$ = (
    formId: string,
    form: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService
      .patchData(environment.rdfApiUrl, `forms/${formId}`, form, info)
      .pipe(map((response) => (response === null ? form : response)));

  getForms$ = (info: ErrorInfo = {} as ErrorInfo): Observable<any[]> =>
    this.appService._getResp(environment.rdfApiUrl, 'forms', info);

  getFieldTypes$ = (info: ErrorInfo = {} as ErrorInfo): Observable<any[]> =>
    this.appService._getResp(environment.rdfApiUrl, 'forms/field-types', info);
}
