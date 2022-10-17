/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, mergeMap, toArray, share } from 'rxjs/operators';
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
  currentFormValue: any;

  constructor(private appService: AppService) {}

  setCurrentFormValue(form: any) {
    this.currentFormValue = form;
  }
  getCurrentFormValue() {
    return this.currentFormValue;
  }

  createForm$ = (
    form: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._postData(environment.rdfApiUrl, 'forms', form, info);

  updateForm$ = (
    form: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService
      .patchData(environment.rdfApiUrl, `forms/${form.id}`, form, info)
      .pipe(map((response) => (response === null ? form : response)));

  deleteForm$ = (
    form: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService
      ._removeData(environment.rdfApiUrl, `forms/${form.id}`, info)
      .pipe(map((response) => (response === null ? form : response)));

  getForms$ = (info: ErrorInfo = {} as ErrorInfo): Observable<any[]> =>
    this.appService._getResp(environment.rdfApiUrl, 'forms', info);

  getFormById$ = (
    id: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._getRespById(environment.rdfApiUrl, 'forms/', id, info);

  getFieldTypes$ = (info: ErrorInfo = {} as ErrorInfo): Observable<any[]> =>
    this.appService._getResp(environment.rdfApiUrl, 'forms/field-types', info);

  publishForm$ = (
    form: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    from(this.postPutFormFieldPayload(form)).pipe(
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

  getResponses$ = (
    respType: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService
      ._getRespFromGateway(
        environment.rdfApiUrl,
        `forms/responses/${respType}`,
        info
      )
      .pipe(share());

  createAbapFormField$ = (
    form: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._postData(
      environment.rdfApiUrl,
      'abap/forms/fields',
      form,
      info
    );

  updateAbapFormField$ = (
    form: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._updateData(
      environment.rdfApiUrl,
      `abap/forms/fields`,
      form,
      info
    );

  deactivateAbapForm$ = (
    form: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> => {
    const payload = this.deactivateFormPayload(form);
    return this.appService._updateData(
      environment.rdfApiUrl,
      `abap/forms`,
      payload,
      info
    );
  };

  deleteAbapFormField$ = (
    params: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._removeData(
      environment.rdfApiUrl,
      `abap/forms/fields${this.appService.getQueryString({
        APPNAME,
        VERSION,
        VALIDFROM,
        VALIDTO,
        ...params
      })}`,
      info
    );

  postPutFormFieldPayload(form) {
    let payloads = [];
    const { sections, name, id } = form;
    sections.forEach((section) => {
      const {
        questions,
        name: sectionName,
        position: sectionPosition
      } = section;

      let index = 0;
      const sectionPayloads = [];
      questions
        .map((question) => {
          index = index + 1;
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

          const { expression, validationMessage, askQuestions } =
            this.getValidationExpression(question, questions);

          sectionPayloads.push({
            UNIQUEKEY: questionId,
            VALIDFROM,
            VALIDTO,
            VERSION,
            SECTIONNAME: sectionName,
            FIELDLABEL: questionName,
            UIPOSITION: index.toString(),
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
            ELEMENTTYPE: 'MULTIFORMTAB',
            PUBLISHED: isPublished,
            UIVALIDATION: expression, //this.getValidationExpression(question),
            UIVALIDATIONMSG: validationMessage, //this.getValidationMessage(question),
            ...this.getProperties(question)
          });

          if (askQuestions && askQuestions.length) {
            askQuestions.forEach((aq) => {
              index = index + 1;
              sectionPayloads.push({
                UNIQUEKEY: aq.id,
                VALIDFROM,
                VALIDTO,
                VERSION,
                SECTIONNAME: sectionName,
                FIELDLABEL: aq.name,
                UIPOSITION: index.toString(),
                UIFIELDTYPE: this.getFieldType(aq),
                ACTIVE: 'X',
                INSTRUCTION: '',
                TEXTSTYLE: '',
                TEXTCOLOR: '',
                MANDATORY: required ? 'X' : '',
                SECTIONPOSITION: sectionPosition.toString(),
                DEFAULTVALUE: this.getDefaultValue(aq),
                APPNAME,
                FORMNAME: id,
                FORMTITLE: aq.name,
                STATUS: 'PUBLISHED',
                ELEMENTTYPE: 'MULTIFORMTAB',
                PUBLISHED: isPublished,
                UIVALIDATION: '', //this.getValidationExpression(question),
                UIVALIDATIONMSG: '', //this.getValidationMessage(question),
                ...this.getProperties(aq)
              });
            });
          }
        })
        .filter((payload) => payload);
      payloads = [...payloads, ...sectionPayloads];
    });
    return payloads;
  }

  deactivateFormPayload(form) {
    const { name, id } = form;
    return {
      VERSION,
      APPNAME,
      FORMNAME: id,
      FORMTITLE: name,
      DEACTIVATE: 'X'
    };
  }

  getDefaultValue(question) {
    return question.fieldType === 'LF' ? question.value : '';
  }

  getProperties(question) {
    let properties = {};
    const { fieldType } = question;
    switch (fieldType) {
      case 'LLF': {
        const { name } = question;
        properties = {
          ...properties,
          FIELDLABEL: this.getDOMStringFromHTML(name),
          DEFAULTVALUE: ''
          //,INSTRUCTION: this.getDOMStringFromHTML(name)
        };
        break;
      }
      case 'RT': {
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
      }
      case 'IMG': {
        const {
          value: { base64, name }
        } = question;
        properties = {
          ...properties,
          IMAGECONTENT: base64,
          IMAGETYPE: `.${name?.split('.').slice(-1)[0].toLowerCase()}`
        };
        break;
      }
      case 'VI':
      case 'DD': {
        const {
          value: { values },
          multi
        } = question;
        const viVALUE = values.map((item, idx) => ({
          [`label${idx + 1}`]: item.title,
          key: item.title,
          color: item.color,
          description: item.title
        }));
        properties = {
          ...properties,
          DDVALUE: JSON.stringify(viVALUE),
          UIFIELDTYPE: multi ? 'DDM' : fieldType
        };
        break;
      }
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

  getValidationExpression(question: any, sectionQuestions: any): any {
    let expression = '';
    let validationMessage = '';
    let globalIndex = 0;
    let askQuestions = [];

    if (!question.logics || !question.logics.length) return expression;

    question.logics.forEach((logic) => {
      const isEmpty = !logic.operand2.length;
      const questionId = question.id;

      // Mandate Questions;
      const mandatedQuestions = logic.mandateQuestions;
      if (mandatedQuestions && mandatedQuestions.length) {
        mandatedQuestions.forEach((mq, index) => {
          globalIndex = globalIndex + 1;
          if (isEmpty) {
            expression = `${expression};${globalIndex}:(E) ${mq} EQ MANDIT IF ${questionId} ${logic.operator} EMPTY`;
          } else {
            expression = `${expression};${globalIndex}:(E) ${mq} EQ MANDIT IF ${questionId} ${logic.operator} (V)${logic.operand2}`;
          }

          const questionIndex = sectionQuestions.findIndex(
            (sq) => sq.id === mq
          );
          if (questionIndex > -1) {
            const mQuestion = sectionQuestions[questionIndex];
            validationMessage = `${validationMessage};${globalIndex}:Please answer the question ${mQuestion.name}`;
          }
        });
      }

      // Hide Questions;
      const hiddenQuestions = logic.hideQuestions;
      if (hiddenQuestions && hiddenQuestions.length) {
        hiddenQuestions.forEach((hq, index) => {
          globalIndex = globalIndex + 1;
          if (isEmpty) {
            expression = `${expression};${globalIndex}:(HI) ${hq} IF ${questionId} ${logic.operator} EMPTY`;
          } else {
            expression = `${expression};${globalIndex}:(HI) ${hq} IF ${questionId} ${logic.operator} (V)${logic.operand2}`;
          }
        });
      }

      // Ask Evidence;
      const evidenceQuestion = logic.askEvidence;
      if (evidenceQuestion && evidenceQuestion.length) {
        globalIndex = globalIndex + 1;
        expression = `${expression};${globalIndex}:(HI) ${evidenceQuestion} IF ${questionId} ${logic.operator} EMPTY OR ${questionId} NE (V)${logic.operand2}`;
        globalIndex = globalIndex + 1;
        if (isEmpty) {
          expression = `${expression};${globalIndex}:(E) ${evidenceQuestion} EQ MANDIT IF ${questionId} ${logic.operator} EMPTY`;
        } else {
          expression = `${expression};${globalIndex}:(E) ${evidenceQuestion} EQ MANDIT IF ${questionId} ${logic.operator} (V)${logic.operand2}`;
        }
      }

      // Ask Questions;
      const questionsToBeAsked = logic.questions || [];
      askQuestions = askQuestions.concat(questionsToBeAsked);
      questionsToBeAsked.forEach((q) => {
        globalIndex = globalIndex + 1;
        expression = `${expression};${globalIndex}:(HI) ${q.id} IF ${questionId} ${logic.operator} EMPTY OR ${questionId} NE (V)${logic.operand2}`;
      });
    });

    if (expression[0] === ';') {
      expression = expression.slice(1, expression.length);
    }
    if (expression[expression.length - 1] === ';') {
      expression = expression.slice(0, expression.length - 1);
    }

    if (validationMessage[0] === ';') {
      validationMessage = validationMessage.slice(1, validationMessage.length);
    }
    if (validationMessage[validationMessage.length - 1] === ';') {
      validationMessage = validationMessage.slice(
        0,
        validationMessage.length - 1
      );
    }

    return { expression, validationMessage, askQuestions };
  }

  getValidationMessage(question) {
    if (!question.logics || !question.logics.length) return '';
    return question.logics[0].validationMessage;
  }

  getDOMStringFromHTML = (value) => {
    let newElement = value.replaceAll('<li>', '');
    newElement = newElement.replaceAll('<br/>', '');
    newElement = newElement.replaceAll('</li>', '\n');
    const parsedElement = new DOMParser().parseFromString(
      newElement,
      'text/html'
    ).documentElement.textContent;

    return parsedElement;
  };
}
