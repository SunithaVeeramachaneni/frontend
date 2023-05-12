/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { format, formatDistance } from 'date-fns';
import { BehaviorSubject, from, Observable, of, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import {
  ErrorInfo,
  InspectionDetailResponse,
  InspectionQueryParam,
  Form,
  FormQueryParam,
  LoadEvent,
  SearchEvent,
  TableEvent,
  Count,
  InspectionDetail,
  FormMetadata
} from './../../../interfaces';

import { formConfigurationStatus, LIST_LENGTH } from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';
import { isJson } from '../utils/utils';
import { oppositeOperatorMap } from 'src/app/shared/utils/fieldOperatorMappings';
import { ResponseSetService } from '../../master-configurations/response-set/services/response-set.service';
import { TranslateService } from '@ngx-translate/core';
import { GetFormList } from 'src/app/interfaces/master-data-management/forms';

const limit = 10000;
@Injectable({
  providedIn: 'root'
})
export class RaceDynamicFormService {
  fetchForms$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);

  constructor(
    private responseSetService: ResponseSetService,
    private toastService: ToastService,
    private appService: AppService,
    private translate: TranslateService
  ) {}

  createTags$ = (
    tags: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._postData(environment.rdfApiUrl, 'datasets', tags, info);

  createDataSet$ = (
    dataset: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._postData(environment.rdfApiUrl, 'datasets', dataset, info);

  updateDataSet$ = (
    datasetId: string,
    dataset: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._putDataToGateway(
      environment.rdfApiUrl,
      `datasets/${datasetId}`,
      dataset,
      info
    );

  getDataSetsByType$ = (
    datasetType: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any[]> =>
    this.appService._getResp(
      environment.rdfApiUrl,
      `datasets/${datasetType}`,
      info
    );
  getDataSetsByFormId$ = (
    datasetType: string,
    formId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any[]> =>
    this.appService._getResp(
      environment.rdfApiUrl,
      `datasets/${datasetType}/${formId}`,
      info
    );

  getFormQuestionsFormsList$(
    queryParams: FormQueryParam,
    filterData: any = null,
    info: ErrorInfo = {} as ErrorInfo
  ) {
    const { fetchType } = queryParams;
    if (
      ['load', 'search'].includes(fetchType) ||
      (['infiniteScroll'].includes(fetchType) && queryParams.next !== null)
    ) {
      const queryParamaters = queryParams;
      if (filterData) {
        Object.assign(queryParamaters, {
          ...filterData,
          plantId: filterData?.plant
        });
      }
      const { displayToast, failureResponse = {} } = info;
      return this.appService
        ._getResp(
          environment.rdfApiUrl,
          'forms/schedule-forms',
          { displayToast, failureResponse },
          queryParamaters
        )
        .pipe(
          map((data) => ({ ...data, rows: this.formatForms(data?.items) }))
        );
    } else {
      return of({ rows: [] });
    }
  }

  getFormsFilter(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this.appService._getLocal(
      '',
      'assets/json/rdf-form-filter.json',
      info
    );
  }

  getTemplateFilter(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this.appService._getLocal(
      '',
      'assets/json/template-filter.json',
      info
    );
  }

  getCreateFromTemplateFilter(
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any[]> {
    return this.appService._getLocal(
      '',
      'assets/json/create-from-template-filter.json',
      info
    );
  }

  getFormsList$(
    queryParams: {
      next?: string;
      limit: number;
      searchKey: string;
      fetchType: string;
    },
    isArchived: boolean = false,
    filterData: any = null
  ) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', queryParams?.searchKey);
    params.set('limit', queryParams?.limit.toString());
    params.set('next', queryParams?.next);
    params.set('fetchType', queryParams?.fetchType);
    params.set('isArchived', String(isArchived));
    params.set(
      'formStatus',
      filterData && filterData.status ? filterData.status : ''
    );
    params.set(
      'modifiedBy',
      filterData && filterData.modifiedBy ? filterData.modifiedBy : ''
    );
    params.set(
      'createdBy',
      filterData && filterData.createdBy ? filterData.createdBy : ''
    );
    params.set(
      'lastModifiedOn',
      filterData && filterData.lastModifiedOn ? filterData.lastModifiedOn : ''
    );
    params.set(
      'plantId',
      filterData && filterData.plant ? filterData.plant : ''
    );
    return this.appService
      ._getResp(environment.rdfApiUrl, 'forms?' + params.toString())
      .pipe(map((res) => this.formatGetRdfFormsResponse(res)));
  }

  getSubmissionFormsList$(
    queryParams: {
      next?: string;
      limit: number;
      searchKey: string;
      fetchType: string;
    },
    filterData: any = null
  ) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', queryParams?.searchKey);
    params.set('limit', queryParams?.limit.toString());
    params.set('next', queryParams?.next);
    params.set('fetchType', queryParams?.fetchType);
    params.set(
      'formStatus',
      filterData && filterData.status ? filterData.status : ''
    );
    params.set(
      'modifiedBy',
      filterData && filterData.modifiedBy ? filterData.modifiedBy : ''
    );
    params.set(
      'lastModifiedOn',
      filterData && filterData.lastModifiedOn ? filterData.lastModifiedOn : ''
    );
    return this.appService
      ._getResp(
        environment.rdfApiUrl,
        'forms/submission/list?' + params.toString()
      )
      .pipe(map((res) => this.formatSubmittedListResponse(res)));
  }

  getFormsCountByFormId$ = (
    formId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Count> =>
    this.appService._getRespById(
      environment.rdfApiUrl,
      'forms/',
      `${formId}/count`,
      info
    );

  getFormsListCount$(isArchived: boolean = false): Observable<number> {
    return this.appService
      ._getResp(environment.rdfApiUrl, 'forms/count?isArchived=' + isArchived)
      .pipe(map((res) => res.items.length || 0));
  }

  getSubmissionFormsListCount$(): Observable<number> {
    return this.appService
      ._getResp(environment.rdfApiUrl, 'forms/submission/count')
      .pipe(map((res) => res.items.length || 0));
  }

  createForm$(
    formListQuery: Pick<
      GetFormList,
      | 'name'
      | 'formLogo'
      | 'description'
      | 'author'
      | 'tags'
      | 'formType'
      | 'formStatus'
      | 'isPublic'
      | 'plantId'
      | 'pdfTemplateConfiguration'
    >
  ) {
    return this.appService._postData(environment.rdfApiUrl, 'forms', {
      name: formListQuery.name,
      formLogo: formListQuery.formLogo,
      description: formListQuery.description,
      formStatus: formListQuery.formStatus,
      pdfTemplateConfiguration: formListQuery.pdfTemplateConfiguration,
      author: formListQuery.author,
      formType: formListQuery.formType,
      tags: formListQuery.tags,
      isPublic: formListQuery.isPublic,
      plantId: formListQuery.plantId,
      isArchived: false,
      isDeleted: false
    });
  }

  updateForm$(formMetaDataDetails) {
    const { plant, ...formMetadata } = formMetaDataDetails.formMetadata;
    if (!formMetadata.id) {
      return;
    }
    return this.appService.patchData(
      environment.rdfApiUrl,
      `forms/${formMetaDataDetails.formMetadata.id}`,
      {
        ...formMetadata,
        _version: formMetaDataDetails.formListDynamoDBVersion
      }
    );
  }

  downloadAttachment$ = (
    formId: string,
    inspectionId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Blob> => {
    const apiURL = `${environment.rdfApiUrl}inspections/${formId}/${inspectionId}`;
    return this.appService.downloadFile(
      apiURL,
      '',
      info,
      true,
      {},
      'arraybuffer'
    );
  };

  getFormById$(id: string) {
    return this.appService._getRespById(
      environment.rdfApiUrl,
      `forms/list/`,
      id
    );
  }

  createFormDetail$(formDetails) {
    return this.appService._postData(
      environment.rdfApiUrl,
      'forms/inspection',
      {
        name: formDetails.formMetadata.name,
        description: formDetails.formMetadata.description,
        formlistID: formDetails.formListId,
        formData: this.formatFormData(
          formDetails.formMetadata,
          formDetails.pages
        ),
        pdfBuilderConfiguration: formDetails.pdfBuilderConfiguration
      }
    );
  }

  updateFormDetail$(formDetails) {
    return this.appService.patchData(
      environment.rdfApiUrl,
      `forms/inspection/${formDetails.formDetailId}`,
      {
        formlistID: formDetails.formListId,
        name: formDetails.formMetadata.name,
        description: formDetails.formMetadata.description,
        formData: this.formatFormData(
          formDetails.formMetadata,
          formDetails.pages
        ),
        _version: formDetails.formDetailDynamoDBVersion
      }
    );
  }

  createAuthoredFormDetail$(formDetails) {
    return this.appService._postData(
      environment.rdfApiUrl,
      `forms/authored?isEdit=${location?.pathname?.startsWith('/forms/edit/')}`,
      {
        formStatus: formDetails.formStatus,
        formDetailPublishStatus: formDetails.formDetailPublishStatus,
        formlistID: formDetails.formListId,
        pages: JSON.stringify(formDetails.pages),
        counter: formDetails.counter,
        version: formDetails.authoredFormDetailVersion.toString()
      }
    );
  }

  updateAuthoredFormDetail$(formDetails) {
    return this.appService.patchData(
      environment.rdfApiUrl,
      `forms/authored/${formDetails.authoredFormDetailId}`,
      {
        formStatus: formDetails.formStatus,
        formDetailPublishStatus: formDetails.formDetailPublishStatus,
        formlistID: formDetails.formListId,
        pages: JSON.stringify(formDetails.pages),
        pdfBuilderConfiguration: formDetails.pdfBuilderConfiguration,
        counter: formDetails.counter,
        id: formDetails.authoredFormDetailId,
        version: formDetails.authoredFormDetailDynamoDBVersion,
        condition: {
          formlistID: { eq: formDetails.formListId },
          version: { eq: formDetails.authoredFormDetailVersion.toString() }
        }
      }
    );
  }

  getAuthoredFormDetailByFormId$(
    formId: string,
    formStatus: string = formConfigurationStatus.draft
  ) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('formStatus', formStatus);
    return from(
      this.appService._getResp(
        environment.rdfApiUrl,
        `forms/authored/${formId}?` + params.toString()
      )
    ).pipe(
      map(({ items }) => {
        items.sort((a, b) => parseInt(b.version, 10) - parseInt(a.version, 10));
        return items[0];
      })
    );
  }

  getAuthoredFormDetailsByFormId$(formId: string) {
    return from(
      this.appService._getResp(
        environment.rdfApiUrl,
        `forms/authored/${formId}?formStatus=Draft`
      )
    ).pipe(map(({ items }) => items));
  }

  getFormDetailByFormId$(formId: string) {
    return from(
      this.appService._getResp(environment.rdfApiUrl, `forms/${formId}`)
    ).pipe(map(({ items }) => items));
  }

  handleError(error: any) {
    const message = error.errors?.length
      ? error.errors[0].message.split(':')[0]
      : error.message;
    this.toastService.show({
      type: 'warning',
      text: message
    });
  }

  formatFormData = (form, pages): string => {
    const forms = [];
    const arrayFieldTypeQuestions = [];
    const formData = {
      FORMNAME: form.name,
      PAGES: []
    };
    formData.PAGES = pages.map((page) => {
      // eslint-disable-next-line prefer-const
      let { sections, questions, logics } = page;

      const pageItem = {
        PAGENAME: page.name,
        SECTIONS: sections.map((section) => {
          let questionsBySection = questions.filter(
            (item) => item.sectionId === section.id
          );
          const logicQuestions = [];

          questionsBySection.forEach((question) => {
            const questionLogics = logics.filter(
              (l) => l.questionId === question.id
            );

            if (questionLogics && questionLogics.length) {
              questionLogics.forEach((logic) => {
                questions.forEach((q) => {
                  if (q.sectionId === `AQ_${logic.id}`) {
                    logicQuestions.push(q);
                  }
                });
              });
            }
          });

          questionsBySection = [...questionsBySection, ...logicQuestions];
          const sectionItem = {
            SECTIONNAME: section.name,
            FIELDS: questionsBySection.map((question) => {
              if (question.fieldType === 'TF') {
                question.fieldType = question.value;
              }
              const questionItem = {
                UNIQUEKEY: question.id,
                FIELDLABEL: question.name,
                UIFIELDTYPE: question.fieldType,
                UIFIELDDESC: question.fieldType,
                DEFAULTVALUE: '' as any,
                UIVALIDATION: this.getValidationExpression(
                  question.id,
                  question,
                  questions,
                  logics
                ),
                MANDATORY: question.required === true ? 'X' : ''
              };

              if (question.fieldType === 'ARD') {
                Object.assign(questionItem, { SUBFORMNAME: question.name }); // Might be name or id.
                arrayFieldTypeQuestions.push(question);
              }

              if (
                question.fieldType === 'VI' ||
                question.value?.type === 'quickResponse'
              ) {
                const viVALUE = this.prepareDDValue(question.value?.value);
                Object.assign(questionItem, {
                  DDVALUE: viVALUE
                });
              }

              if (question.fieldType === 'NF') {
                Object.assign(questionItem, {
                  MEASUREMENT:
                    question.unitOfMeasurement !== 'None'
                      ? question.unitOfMeasurement
                      : ''
                });
                if (question.rangeMetadata.min && question.rangeMetadata.max) {
                  Object.assign(questionItem, {
                    DEFAULTVALUE: JSON.stringify({
                      min: question.rangeMetadata.min + '',
                      max: question.rangeMetadata.max + '',
                      minMsg: `${question.rangeMetadata.minAction}: ${question.rangeMetadata.minMsg}`,
                      maxMsg: `${question.rangeMetadata.maxAction}: ${question.rangeMetadata.maxMsg}`,
                      value: ''
                    })
                  });
                }
              }

              if (
                question.fieldType === 'DD' &&
                question.value?.type === 'globalResponse'
              ) {
                let currentGlobalResponseValues;
                const currenGlobalResponse$ = this.responseSetService
                  .fetchAllGlobalResponses$()
                  .pipe(
                    tap((responses) => {
                      currentGlobalResponseValues = JSON.parse(
                        responses.items.find(
                          (item) => item.id === question.value.id
                        )
                      );
                    })
                  );
                currenGlobalResponse$.subscribe();
                questionItem.UIFIELDTYPE = question.multi
                  ? 'DDM'
                  : question.fieldType;
                Object.assign(questionItem, {
                  DDVALUE: currentGlobalResponseValues
                    ? this.prepareDDValue(currentGlobalResponseValues)
                    : []
                });
              }

              if (question.fieldType === 'RT') {
                const { min, max, increment } = question.value;
                questionItem.DEFAULTVALUE = `${min},${max},${increment}`;
              }

              if (question.fieldType === 'LF') {
                questionItem.DEFAULTVALUE = question.value;
              }

              if (question.fieldType === 'DT') {
                questionItem.UIFIELDTYPE =
                  question.value.date && question.value.time
                    ? 'DT'
                    : question.value.date
                    ? 'DF'
                    : 'TIF';
                questionItem.DEFAULTVALUE =
                  question.value.date && question.value.time
                    ? 'CDT'
                    : question.value.date
                    ? 'CD'
                    : 'CT';
              }

              if (question.fieldType === 'HL') {
                questionItem.DEFAULTVALUE = question.value.title;
                Object.assign(questionItem, {
                  FIELDVALUE: question.value.link
                });
              }

              if (question.fieldType === 'INST') {
                if (
                  question.value.tag.title !== this.translate.instant('noneTag')
                ) {
                  Object.assign(questionItem, {
                    TAG: JSON.stringify({
                      title: question.value.tag.title,
                      colour: question.value.tag.colour
                    })
                  });
                } else {
                  Object.assign(questionItem, {
                    TAG: null
                  });
                }
                Object.assign(questionItem, {
                  FIELDVALUE: question.value.images
                    .filter((image) => image !== null)
                    .map((image) => image.objectKey.substring('public/'.length))
                    .join(';'),
                  DOCFILE:
                    question.value.pdf?.objectKey.substring('public/'.length) ||
                    ''
                });
              }
              return questionItem;
            })
          };

          return sectionItem;
        })
      };

      return pageItem;
    });

    forms.push(formData);
    return JSON.stringify({ FORMS: forms });
  };

  getValidationExpression(questionId, question, questions, logics) {
    let expression = '';
    let globalIndex = 0;
    const logicsT = JSON.parse(JSON.stringify(logics));
    const questionLogics = logicsT.filter(
      (logic) => logic.questionId === questionId
    );
    if (!questionLogics || !questionLogics.length) return expression;

    const fieldType = question.fieldType;

    questionLogics.forEach((logic) => {
      const isEmpty = !logic.operand2.length;

      if (fieldType === 'CB') {
        logic.operand2 = logic.operand2 ? 'X' : '';
      }

      // Mandate Questions;
      const mandatedQuestions = logic.mandateQuestions;
      if (mandatedQuestions && mandatedQuestions.length) {
        mandatedQuestions.forEach((mq) => {
          globalIndex = globalIndex + 1;
          if (isEmpty) {
            expression = `${expression};${globalIndex}:(E) ${mq} EQ MANDIT IF ${questionId} ${logic.operator} EMPTY`;
          } else {
            expression = `${expression};${globalIndex}:(E) ${mq} EQ MANDIT IF ${questionId} ${logic.operator} (V)${logic.operand2} AND ${questionId} NE EMPTY`;
          }
        });
      }

      // Hide Questions;
      const hiddenQuestions = logic.hideQuestions;
      if (hiddenQuestions && hiddenQuestions.length) {
        hiddenQuestions.forEach((hq) => {
          globalIndex = globalIndex + 1;
          if (isEmpty) {
            if (fieldType === 'CB') {
              expression = `${expression};${globalIndex}:(HI) ${hq} IF ${questionId} EQ EMPTY`;
            } else {
              expression = `${expression};${globalIndex}:(HI) ${hq} IF ${questionId} ${logic.operator} EMPTY`;
            }
          } else {
            if (fieldType === 'CB') {
              expression = `${expression};${globalIndex}:(HI) ${hq} IF ${questionId} EQ EMPTY`;
            } else {
              expression = `${expression};${globalIndex}:(HI) ${hq} IF ${questionId} ${logic.operator} (V)${logic.operand2} AND ${questionId} NE EMPTY`;
            }
          }
        });
      }

      // Ask Questions;
      const askQuestions = questions.filter(
        (q) => q.sectionId === `AQ_${logic.id}`
      );
      askQuestions.forEach((q) => {
        globalIndex = globalIndex + 1;
        const oppositeOperator = oppositeOperatorMap[logic.operator];
        expression = `${expression};${globalIndex}:(HI) ${q.id} IF ${questionId} EQ EMPTY OR ${questionId} ${oppositeOperator} (V)${logic.operand2}`;
      });
    });
    if (expression[0] === ';') {
      expression = expression.slice(1, expression.length);
    }
    if (expression[expression.length - 1] === ';') {
      expression = expression.slice(0, expression.length - 1);
    }
    return expression;
  }

  fetchAllFormListNames$() {
    return this.appService
      ._getResp(environment.rdfApiUrl, 'forms/name')
      .pipe(map((res) => res.items));
  }

  getAuthoredFormDetail$(formlistID: string) {
    return from(
      this.appService._getResp(
        environment.rdfApiUrl,
        `forms/authored/${formlistID}?formStatus=Draft`
      )
    ).pipe(map(({ items }) => items));
  }

  getInspectionDetailByInspectionId$ = (submissionId: string) =>
    this.appService._getResp(
      environment.rdfApiUrl,
      `forms/submission/detail/${submissionId}`
    );

  private formatGetRdfFormsResponse(resp: any) {
    const rows =
      resp?.items
        ?.sort(
          (a, b) =>
            new Date(b?.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        ?.map((p) => ({
          ...p,
          preTextImage: {
            image: p?.formLogo,
            style: {
              width: '40px',
              height: '40px',
              marginRight: '10px'
            },
            condition: true
          },
          lastPublishedBy: p.lastPublishedBy,
          author: p.author,
          publishedDate: p.publishedDate ? p.publishedDate : '',
          isArchivedAt: p?.isArchivedAt ? p?.isArchivedAt : ''
        })) || [];
    const count = resp?.items.length || 0;
    const next = resp?.next;
    return {
      count,
      rows,
      next
    };
  }

  private formatSubmittedListResponse(resp: any) {
    const rows =
      resp.items
        .sort(
          (a, b) =>
            new Date(b?.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        ?.map((p: any) => {
          let responses = '0/0';
          if (p?.formSubmissionListFormSubmissionDetail?.items?.length > 0) {
            p?.formSubmissionListFormSubmissionDetail?.items.forEach((form) => {
              responses = this.countFormSubmissionsResponses(
                isJson(form?.formData) ? JSON.parse(form?.formData)?.FORMS : []
              );
            });
          }
          return {
            ...p,
            preTextImage: {
              image: p.formLogo
                ? p.formLogo
                : 'assets/rdf-forms-icons/formlogo.svg',
              style: {
                width: '40px',
                height: '40px',
                marginRight: '10px'
              },
              condition: true
            },
            responses,
            createdAt: format(new Date(p?.createdAt), 'do MMM'),
            updatedAt: formatDistance(new Date(p?.updatedAt), new Date(), {
              addSuffix: true
            })
          };
        }) || [];
    const next = resp?.next;
    return {
      rows,
      next
    };
  }

  prepareDDValue = (values) =>
    values.map((item, idx) => ({
      [`label${idx + 1}`]: item.title,
      key: item.title,
      color: item.color,
      description: item.title
    }));

  private countFormSubmissionsResponses(rows = []): string {
    const updatedResponse = {
      total: 0,
      count: 0
    };
    rows?.forEach((page) => {
      page?.PAGES?.forEach((p) => {
        p?.SECTIONS?.forEach((section) => {
          const updatedCounts = section?.FIELDS.reduce(
            (acc, cur) => {
              acc.total += 1;
              if (cur?.FIELDVALUE) acc.count += 1;
              return acc;
            },
            {
              total: 0,
              count: 0
            }
          );
          updatedResponse.count += updatedCounts?.count || 0;
          updatedResponse.total += updatedCounts?.total || 0;
        });
      });
    });
    return `${updatedResponse.count}/${updatedResponse.total}`;
  }

  fetchAllForms$ = () => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', '');
    params.set('limit', LIST_LENGTH.toString());
    params.set('next', '');
    params.set('fetchType', 'load');
    params.set('isArchived', 'false');
    params.set('modifiedBy', '');
    params.set('formStatus', '');
    params.set('authoredBy', '');
    params.set('lastModifiedOn', '');
    return this.appService
      ._getResp(environment.rdfApiUrl, 'forms?' + params.toString(), {
        displayToast: true,
        failureResponse: {}
      })
      .pipe(map((res) => this.formatGetRdfFormsResponse(res)));
  };
  fetchAllArchivedForms$ = () => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', '');
    params.set('limit', LIST_LENGTH.toString());
    params.set('next', '');
    params.set('fetchType', 'load');
    params.set('isArchived', 'true');
    params.set('modifiedBy', '');
    params.set('formStatus', '');
    params.set('authoredBy', '');
    params.set('lastModifiedOn', '');
    return this.appService
      ._getResp(environment.rdfApiUrl, 'forms?' + params.toString(), {
        displayToast: true,
        failureResponse: {}
      })
      .pipe(map((res) => this.formatGetRdfFormsResponse(res)));
  };
  fetchAllSchedulerForms$ = () => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', '');
    params.set('limit', LIST_LENGTH.toString());
    params.set('next', '');
    params.set('fetchType', 'load');
    params.set('isArchived', 'false');
    params.set('modifiedBy', '');
    params.set('formStatus', '');
    params.set('authoredBy', '');
    params.set('lastModifiedOn', '');
    return this.appService
      ._getResp(
        environment.rdfApiUrl,
        'forms/schedule-forms?' + params.toString(),
        { displayToast: true, failureResponse: {} }
      )
      .pipe(map((data) => ({ ...data, rows: this.formatForms(data?.rows) })));
  };

  getFilter(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this.appService._getLocal('', 'assets/json/rdf-filter.json', info);
  }

  getInspectionFilter(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this.appService._getLocal(
      '',
      'assets/json/forms-inspection-filter.json',
      info
    );
  }
  getArchivedFilter(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this.appService._getLocal(
      '',
      'assets/json/rdf-archived-filter.json',
      info
    );
  }
  fetchAllRounds$ = () => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', '');
    params.set('limit', '2000000');
    params.set('next', '');
    params.set('formId', '');
    params.set('status', '');
    params.set('assignedTo', '');
    params.set('dueDate', '');
    return this.appService
      ._getResp(environment.rdfApiUrl, 'inspections?' + params.toString(), {
        displayToast: true,
        failureResponse: {}
      })
      .pipe(map((res) => this.formatInspections(res.items || [])));
  };

  getInspectionsList$(
    queryParams: InspectionQueryParam,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<InspectionDetailResponse> {
    const { fetchType, ...rest } = queryParams;
    if (
      ['load', 'search'].includes(queryParams.fetchType) ||
      (['infiniteScroll'].includes(queryParams.fetchType) &&
        queryParams.next !== null)
    ) {
      const { displayToast, failureResponse = {} } = info;
      return this.appService
        ._getResp(
          environment.rdfApiUrl,
          'inspections',
          { displayToast, failureResponse },
          rest
        )
        .pipe(
          map((data) => ({ ...data, rows: this.formatInspections(data.items) }))
        );
    } else {
      return of({
        rows: []
      } as InspectionDetailResponse);
    }
  }

  private formatInspections(inspections: any[] = []): any[] {
    const rows = inspections
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )
      .map((p) => ({
        ...p,
        preTextImage: {
          image: p.formLogo,
          style: {
            width: '40px',
            height: '40px',
            marginRight: '10px'
          },
          condition: true
        },
        dueDate: p.dueDate ? format(new Date(p.dueDate), 'dd MMM yyyy') : '',
        tasksCompleted: `${p.totalTasksCompleted}/${p.totalTasks},${
          p.totalTasks > 0
            ? Math.round(
                (Math.abs(p.totalTasksCompleted / p.totalTasks) +
                  Number.EPSILON) *
                  100
              )
            : 0
        }%`
      }));
    return rows;
  }

  private formatForms(forms: Form[] = []): Form[] {
    const rows = forms
      .sort(
        (a, b) =>
          new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
      )
      .map((p) => ({
        ...p,
        preTextImage: {
          image: p?.formLogo,
          style: {
            width: '40px',
            height: '40px',
            marginRight: '10px'
          },
          condition: true
        },
        lastPublishedBy: p?.lastPublishedBy,
        author: p?.author,
        publishedDate: p?.publishedDate ? p.publishedDate : ''
      }));
    return rows;
  }

  updateInspection$ = (
    inspectionId: string,
    inspectionDetail: InspectionDetail,
    type: 'due-date' | 'assigned-to',
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<InspectionDetail> =>
    this.appService
      .patchData(
        environment.rdfApiUrl,
        `inspections/${inspectionId}/${type}`,
        inspectionDetail,
        info
      )
      .pipe(
        map((response) => (response === null ? inspectionDetail : response))
      );

  fetchAllTemplates$ = () =>
    this.appService
      ._getResp(
        environment.rdfApiUrl,
        'templates',
        { displayToast: true, failureResponse: {} },
        {
          limit: 0,
          skip: 0
        }
      )
      .pipe(map((data) => this.formatGetRdfFormsResponse({ items: data })));

  fetchTemplateByName$ = (name: string) =>
    this.appService
      ._getResp(
        environment.rdfApiUrl,
        'templates',
        { displayToast: true, failureResponse: {} },
        {
          limit: 1,
          skip: 0,
          name
        }
      )
      .pipe(map((data) => this.formatGetRdfFormsResponse({ items: data })));

  fetchTemplateById$ = (id: string) =>
    this.appService
      ._getResp(
        environment.rdfApiUrl,
        'templates',
        { displayToast: true, failureResponse: {} },
        {
          skip: 0,
          id
        }
      )
      .pipe(map((data) => this.formatGetRdfFormsResponse({ items: data })));

  createTemplate$ = (templateMetadata: FormMetadata) =>
    this.appService._postData(environment.rdfApiUrl, 'templates', {
      data: templateMetadata
    });

  createAuthoredTemplateDetail$ = (templateId: string, templateMetadata: any) =>
    this.appService._postData(
      environment.rdfApiUrl,
      `templates/${templateId}`,
      {
        data: {
          formStatus: templateMetadata.formStatus,
          pages: JSON.stringify(templateMetadata.pages),
          counter: templateMetadata.counter
        }
      }
    );

  updateTemplate$ = (templateId: string, templateMetadata: any) =>
    this.appService.patchData(
      environment.rdfApiUrl,
      `templates/${templateId}`,
      {
        data: templateMetadata
      }
    );

  deleteTemplate$ = (templateId: string) =>
    this.appService._removeData(
      environment.rdfApiUrl,
      `templates/${templateId}`
    );
}
