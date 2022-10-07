/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { ErrorInfo } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';

const VALIDFROM = '20221002135512';
const VALIDTO = '99991230183000';
const VERSION = '001';
const APPNAME = 'MWORKORDER';
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

  publishForm$ = (
    form: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    from(this.postOrPutFormPayload(form)).pipe(
      mergeMap((payload) => {
        const { PUBLISHED, ...rest } = payload;
        if (!PUBLISHED) {
          return this.createAbapFormField$(rest, info).pipe(
            map((resp) =>
              Object.keys(resp).length === 0 ? resp : rest.UNIQUEKEY
            )
          );
        } else {
          return this.updateAbapFormField$(rest, info).pipe(
            map((resp) => (resp === null ? rest.UNIQUEKEY : resp))
          );
        }
      }),
      toArray()
    );

  createAbapFormField$ = (
    form: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._postData(environment.rdfApiUrl, 'abap/forms', form, info);

  updateAbapFormField$ = (
    form: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._updateData(
      environment.rdfApiUrl,
      `abap/forms`,
      form,
      info
    );

  deleteAbapFormField$ = (
    params: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._removeData(
      environment.rdfApiUrl,
      `abap/forms${this.appService.getQueryString({
        APPNAME,
        VERSION,
        VALIDFROM,
        VALIDTO,
        ...params
      })}`,
      info
    );

  postOrPutFormPayload(form) {
    let payloads = [];
    const { sections, name, id } = form;
    sections.forEach((section) => {
      const {
        questions,
        name: sectionName,
        position: sectionPosition
      } = section;
      const sectionPayloads = questions
        .map((question) => {
          const {
            id: questionId,
            name: questionName,
            position: questionPosition,
            required,
            isPublished,
            isPublishedTillSave
          } = question;

          if (isPublishedTillSave) {
            return null;
          }
          return {
            UNIQUEKEY: questionId,
            VALIDFROM,
            VALIDTO,
            VERSION,
            SECTIONNAME: sectionName,
            FIELDLABEL: questionName,
            UIPOSITION: questionPosition.toString(),
            UIFIELDTYPE: this.getFieldType(question),
            ACTIVE: 'X',
            INSTRUCTION: '',
            TEXTSTYLE: '',
            TEXTCOLOR: '',
            MANDATORY: required ? 'X' : '',
            SECTIONPOSITION: sectionPosition.toString(),
            DEFAULTVALUE: this.getDefaultValue(question),
            APPNAME,
            FORMNAME: id,
            FORMTITLE: name,
            STATUS: 'PUBLISHED',
            IMAGECONTENT: '',
            ELEMENTTYPE: 'MULTIFORMTAB',
            PUBLISHED: isPublished,
            ...this.getProperties(question)
          };
        })
        .filter((payload) => payload);
      payloads = [...payloads, ...sectionPayloads];
    });
    return payloads;
  }

  getDefaultValue(question) {
    return question.fieldType === 'LF' ? question.value : '';
  }

  getProperties(question) {
    let properties = {};
    const { fieldType } = question;
    switch (fieldType) {
      case 'RT':
        const {
          value: { min, max, increment }
        } = question;
        properties = {
          ...properties,
          MINVAL: min.toString(),
          MAXVAL: max.toString(),
          RINTERVAL: increment.toString()
        };
        break;
      case 'IMF':
        const {
          value: { base64, name }
        } = question;
        properties = {
          ...properties,
          FORMCONTENT: base64,
          FILETYPE: name.split('.').slice(-1)[0].toLowerCase()
        };
        break;
      case 'VI':
        const { value } = question;
        const ddVALUE = value.map((item, idx) => ({
          [`LABEL${idx + 1}`]: item.title
        }));
        properties = {
          ...properties,
          DDVALUE: JSON.stringify(ddVALUE)
        };
        break;
      default:
      // do nothing
    }
    return properties;
  }

  getFieldType(question) {
    const { value, fieldType } = question;
    switch (fieldType) {
      case 'TF':
        return value;
      default:
        return fieldType;
    }
  }
}
