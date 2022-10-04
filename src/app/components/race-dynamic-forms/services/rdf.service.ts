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
  ): Observable<any> => {
    const payloads = this.getFormPayload(form);
    console.log(payloads);
    return from(this.getFormPayload(form)).pipe(
      mergeMap((payload) => {
        const { PUBLISHED, ...rest } = payload;
        if (!PUBLISHED) {
          return this.appService._postData(
            environment.rdfApiUrl,
            'abap/forms',
            rest,
            info
          );
        } else {
          return this.appService._updateData(
            environment.rdfApiUrl,
            'abap/forms',
            rest,
            info
          );
        }
      }),
      toArray()
    );
  };

  getFormPayload(form) {
    let payloads = [];
    const { sections, name, id } = form;
    sections.forEach((section) => {
      const {
        questions,
        name: sectionName,
        position: sectionPosition
      } = section;
      payloads = questions.map((question) => {
        const {
          id: questionId,
          name: questionName,
          position: questionPosition,
          fieldType,
          required,
          isPublished
        } = question;
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
          UIPOSITION: `${questionPosition}`,
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
          SECTIONPOSITION: `${sectionPosition}`,
          DEFAULTVALUE: '',
          APITYPE: '',
          APINAME: '',
          APIFIELD: '',
          APIKEYS: '',
          BOSTATUS: '',
          SCAN: '',
          APPNAME,
          FORMNAME: `FT${id.substr(-4)}`,
          FORMTITLE: name,
          STATUS: 'PUBLISHED',
          IMAGECONTENT: '',
          ELEMENTTYPE: 'MULTIFORMTAB',
          PUBLISHED: isPublished
        };
      });
    });
    return payloads;
  }
}
