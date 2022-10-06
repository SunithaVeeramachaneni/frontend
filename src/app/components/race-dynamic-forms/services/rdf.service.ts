/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, mergeMap, tap, toArray } from 'rxjs/operators';
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
  ): Observable<any> => {
    const payloads = this.getFormPayload(form);
    return from(this.getFormPayload(form)).pipe(
      mergeMap((payload) => {
        const { PUBLISHED, ...rest } = payload;
        if (!PUBLISHED) {
          return this.createAbapForm$(rest).pipe(
            map((resp) =>
              Object.keys(resp).length === 0 ? resp : rest.UNIQUEKEY
            )
          );
        } else {
          return this.updateAbapForm$(rest).pipe(
            map((resp) => (resp === null ? rest.UNIQUEKEY : resp))
          );
        }
      }),
      toArray(),
      tap(console.log)
    );
  };

  createAbapForm$ = (
    form: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._postData(environment.rdfApiUrl, 'abap/forms', form, info);

  updateAbapForm$ = (
    form: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._updateData(
      environment.rdfApiUrl,
      `abap/forms`,
      form,
      info
    );

  getFormPayload(form) {
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
            fieldType,
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
            REFFIELD: '',
            SUBFORMNAME: '',
            FIELDLABEL: questionName,
            PLACEHOLDER: '',
            UIPOSITION: questionPosition.toString(),
            UIFIELDTYPE: fieldType,
            DDVALUE: '',
            DDTABNAME: '',
            DDFIELDNAME: '',
            TEXTREQ: '',
            TEXTFIELDNAME: '',
            TEXTKEYFNAME: '',
            TEXTTABLE: '',
            DESCRIPTIONALT: '',
            ALIGNMENT: '',
            DISPLAYSIZE: '',
            ACTIVE: 'X',
            INSTRUCTION: '',
            TEXTSTYLE: '',
            TEXTCOLOR: '',
            MANDATORY: required ? 'X' : '',
            FOLLOWUPIND: '',
            FOLLOWUPVALUE: '',
            OVERVIEW: '',
            DETAIL: '',
            SENDEMAIL: '',
            UIVALIDATIONMSG: '',
            UIVALIDATION: '',
            EMAILCONDITION: '',
            SENDTO: '',
            SUBJECT: '',
            MESSAGEBODY: '',
            SECTIONPOSITION: sectionPosition.toString(),
            DEFAULTVALUE: this.getDefaultValue(question),
            APITYPE: '',
            APINAME: '',
            APIFIELD: '',
            APIKEYS: '',
            BOSTATUS: '',
            SCAN: '',
            APPNAME,
            FORMNAME: `FT${id.substr(-4)}`,
            // FORMNAME: `FORMTESTING`,
            FORMTITLE: name,
            STATUS: 'PUBLISHED',
            IMAGECONTENT: '',
            ELEMENTTYPE: 'MULTIFORMTAB',
            PUBLISHED: isPublished,
            ...this.getSliderProperties(question)
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

  getSliderProperties(question) {
    const {
      value: { min, max, increment },
      fieldType
    } = question;
    if (fieldType === 'RT') {
      return {
        MINVAL: min.toString(),
        MAXVAL: max.toString(),
        RINTERVAL: increment.toString()
      };
    }
    return null;
  }
}
