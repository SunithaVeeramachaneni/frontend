/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { format, formatDistance } from 'date-fns';
import { BehaviorSubject, from, Observable, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  APIService,
  GetFormListQuery,
  ListFormListsQuery,
  ListFormSubmissionListsQuery
} from 'src/app/API.service';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import {
  ErrorInfo,
  Form,
  FormQueryParam,
  LoadEvent,
  SearchEvent,
  TableEvent
} from './../../../interfaces';
import { Store } from '@ngrx/store';
import { formConfigurationStatus, LIST_LENGTH } from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';
import { isJson } from '../utils/utils';
import { oppositeOperatorMap } from 'src/app/shared/utils/fieldOperatorMappings';
import { getResponseSets } from 'src/app/forms/state';
import { TranslateService } from '@ngx-translate/core';

const limit = 10000;
@Injectable({
  providedIn: 'root'
})
export class RaceDynamicFormService {
  private formCreatedUpdatedSubject = new BehaviorSubject<any>({});

  fetchForms$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);

  formCreatedUpdated$ = this.formCreatedUpdatedSubject.asObservable();

  constructor(
    private toastService: ToastService,
    private appService: AppService,
    private store: Store,
    private translate: TranslateService
  ) {}

  setFormCreatedUpdated(data: any) {
    this.formCreatedUpdatedSubject.next(data);
  }

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
    info: ErrorInfo = {} as ErrorInfo
  ) {
    const { fetchType, ...rest } = queryParams;
    if (
      ['load', 'search'].includes(queryParams.fetchType) ||
      (['infiniteScroll'].includes(queryParams.fetchType) &&
        queryParams.nextToken !== null)
    ) {
      const isSearch = fetchType === 'search';
      if (isSearch) {
        rest.nextToken = '';
      }
      const { displayToast, failureResponse = {} } = info;
      return this.appService
        ._getResp(
          environment.rdfApiUrl,
          'forms/schedule-forms',
          { displayToast, failureResponse },
          rest
        )
        .pipe(map((data) => ({ ...data, rows: this.formatForms(data?.rows) })));
    } else {
      return of({ rows: [] });
    }
  }

  getInspectionFilter(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this.appService._getLocal(
      '',
      'assets/json/rdf-inspection-filter.json',
      info
    );
  }
  getFormsFilter(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this.appService._getLocal(
      '',
      'assets/json/rdf-form-filter.json',
      info
    );
  }

  getFormsList$(
    queryParams: {
      nextToken?: string;
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
    params.set('nextToken', queryParams?.nextToken);
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
      'authoredBy',
      filterData && filterData.authoredBy ? filterData.authoredBy : ''
    );
    params.set(
      'lastModifiedOn',
      filterData && filterData.lastModifiedOn ? filterData.lastModifiedOn : ''
    );
    return this.appService
      ._getResp(environment.rdfApiUrl, 'forms?' + params.toString())
      .pipe(map((res) => this.formateGetRdfFormsResponse(res)));
  }

  getSubmissionFormsList$(
    queryParams: {
      nextToken?: string;
      limit: number;
      searchKey: string;
      fetchType: string;
    },
    filterData: any = null
  ) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', queryParams?.searchKey);
    params.set('limit', queryParams?.limit.toString());
    params.set('nextToken', queryParams?.nextToken);
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
      GetFormListQuery,
      | 'name'
      | 'formLogo'
      | 'description'
      | 'author'
      | 'tags'
      | 'formType'
      | 'formStatus'
      | 'isPublic'
    >
  ) {
    return this.appService._postData(environment.rdfApiUrl, 'forms', {
      name: formListQuery.name,
      formLogo: formListQuery.formLogo,
      description: formListQuery.description,
      formStatus: formListQuery.formStatus,
      author: formListQuery.author,
      formType: formListQuery.formType,
      tags: formListQuery.tags,
      isPublic: formListQuery.isPublic,
      isArchived: false,
      isDeleted: false
    });
  }

  updateForm$(formMetaDataDetails) {
    return this.appService.patchData(
      environment.rdfApiUrl,
      `forms/${formMetaDataDetails?.formMetadata?.id}`,
      {
        ...formMetaDataDetails.formMetadata,
        _version: formMetaDataDetails.formListDynamoDBVersion
      }
    );
  }

  getFormById$(id: string) {
    return this.appService._getRespById(
      environment.rdfApiUrl,
      `forms/list/`,
      id
    );
  }

  createFormDetail$(formDetails) {
    return this.appService._postData(environment.rdfApiUrl, 'forms/detail', {
      formlistID: formDetails.formListId,
      formData: this.formatFormData(formDetails.formMetadata, formDetails.pages)
    });
  }

  updateFormDetail$(formDetails) {
    return this.appService.patchData(
      environment.rdfApiUrl,
      `forms/detail/${formDetails.formDetailId}`,
      {
        formlistID: formDetails.formListId,
        formData: this.formatFormData(
          formDetails.formMetadata,
          formDetails.pages
        ),
        _version: formDetails.formDetailDynamoDBVersion
      }
    );
  }

  createAuthoredFormDetail$(formDetails) {
    return this.appService._postData(environment.rdfApiUrl, 'forms/authored', {
      formStatus: formDetails.formStatus,
      formDetailPublishStatus: formDetails.formDetailPublishStatus,
      formlistID: formDetails.formListId,
      pages: JSON.stringify(formDetails.pages),
      counter: formDetails.counter,
      version: formDetails.authoredFormDetailVersion.toString()
    });
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

  getResponseSet$(queryParams: {
    nextToken?: string;
    limit?: number;
    responseType: string;
  }) {
    const params: URLSearchParams = new URLSearchParams();
    if (queryParams?.limit) params.set('limit', queryParams?.limit?.toString());
    if (queryParams?.nextToken) params.set('nextToken', queryParams?.nextToken);
    params.set('type', queryParams?.responseType);
    return this.appService._getResp(
      environment.operatorRoundsApiUrl,
      'round-plans/response-sets?' + params.toString()
    );
  }

  createResponseSet$(responseSet) {
    return this.appService._postData(
      environment.operatorRoundsApiUrl,
      'round-plans/response-sets',
      {
        type: responseSet.responseType,
        name: responseSet.name,
        description: responseSet?.description,
        isMultiColumn: responseSet.isMultiColumn,
        values: responseSet.values
      }
    );
  }

  updateResponseSet$(responseSet) {
    return this.appService.patchData(
      environment.operatorRoundsApiUrl,
      `round-plans/response-sets/${responseSet.id}`,
      {
        type: responseSet.responseType,
        name: responseSet.name,
        description: responseSet.description,
        isMultiColumn: responseSet.isMultiColumn,
        values: responseSet.values,
        _version: responseSet.version
      }
    );
  }

  deleteResponseSet$(responseSetId: string) {
    return this.appService._removeData(
      environment.operatorRoundsApiUrl,
      `round-plans/response-sets/${responseSetId}`
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
                const currenGlobalResponse$ = this.store
                  .select(getResponseSets)
                  .pipe(
                    tap((responses) => {
                      currentGlobalResponseValues = JSON.parse(
                        responses.find((item) => item.id === question.value.id)
                          ?.values
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
                    TAG: {
                      TITLE: question.value.tag.title,
                      COLOUR: question.value.tag.colour
                    }
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

  getInspectionDetailByInspectionId$ = (submissionId: string) => {
    return this.appService._getResp(
      environment.rdfApiUrl,
      `forms/submission/detail/${submissionId}`
    );
  };

  private formateGetRdfFormsResponse(resp: ListFormListsQuery) {
    const rows =
      resp.items
        .sort(
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
    const nextToken = resp?.nextToken;
    return {
      count,
      rows,
      nextToken
    };
  }

  private formatSubmittedListResponse(resp: ListFormSubmissionListsQuery) {
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
    const nextToken = resp?.nextToken;
    return {
      rows,
      nextToken
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
    params.set('nextToken', '');
    params.set('fetchType', 'load');
    params.set('isArchived', 'false');
    params.set('modifiedBy', '');
    params.set('formStatus', '');
    params.set('authoredBy', '');
    params.set('lastModifiedOn', '');
    return this.appService
      ._getResp(environment.rdfApiUrl, 'forms?' + params.toString())
      .pipe(map((res) => this.formateGetRdfFormsResponse(res)));
  };

  getFilter(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this.appService._getLocal('', 'assets/json/rdf-filter.json', info);
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
}
