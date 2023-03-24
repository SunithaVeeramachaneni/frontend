/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { API, graphqlOperation } from 'aws-amplify';
import { format, formatDistance } from 'date-fns';
import { BehaviorSubject, from, Observable, of, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  APIService,
  DeleteFormListInput,
  GetFormListQuery,
  ListFormListsQuery,
  ListFormSubmissionListsQuery,
  ModelFormSubmissionListFilterInput,
  UpdateAuthoredFormDetailInput,
  UpdateFormDetailInput
} from 'src/app/API.service';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import {
  ErrorInfo,
  InspectionDetailResponse,
  InspectionQueryParam,
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
    private readonly awsApiService: APIService,
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

  getFormsList$(
    queryParams: {
      nextToken?: string;
      limit: number;
      searchKey: string;
      fetchType: string;
    },
    isArchived: boolean = false,
    filterParam: any = null
  ) {
    if (
      ['load', 'search'].includes(queryParams.fetchType) ||
      (['infiniteScroll'].includes(queryParams.fetchType) &&
        queryParams.nextToken !== null)
    ) {
      const isSearch = queryParams.fetchType === 'search';
      let filter = {
        ...(queryParams.searchKey && {
          searchTerm: { contains: queryParams?.searchKey.toLowerCase() }
        }),
        isArchived: {
          eq: isArchived
        },
        isDeleted: {
          eq: false
        }
      };
      if (filterParam && filterParam.status) {
        filter['formStatus'] = {
          eq: filterParam.status
        };
      }
      if (filterParam && filterParam.modifiedBy) {
        filter['lastPublishedBy'] = {
          eq: filterParam.modifiedBy
        };
      }
      if (filterParam && filterParam.authoredBy) {
        filter['author'] = {
          eq: filterParam.authoredBy
        };
      }
      if (filterParam && filterParam.lastModifiedOn) {
        filter['updatedAt'] = {
          eq: new Date(filterParam.lastModifiedOn).toISOString()
        };
      }
      return from(
        this.awsApiService.ListFormLists(
          filter,
          !isSearch && queryParams.limit,
          !isSearch && queryParams.nextToken
        )
      ).pipe(map((res) => this.formatGraphQLFormsResponse(res)));
    } else {
      return of({
        count: 0,
        rows: [],
        nextToken: null
      });
    }
  }

  getSubmissionFormsList$(queryParams: {
    nextToken?: string;
    limit: number;
    searchKey: string;
    fetchType: string;
  }) {
    if (
      ['load', 'search'].includes(queryParams.fetchType) ||
      (['infiniteScroll'].includes(queryParams.fetchType) &&
        queryParams.nextToken !== null)
    ) {
      const isSearch = queryParams.fetchType === 'search';
      return from(
        this._ListFormSubmissionLists(
          {
            ...(queryParams.searchKey && {
              searchTerm: { contains: queryParams?.searchKey.toLowerCase() }
            })
          },
          !isSearch && queryParams.limit,
          !isSearch && queryParams.nextToken
        )
      ).pipe(map((res) => this.formatSubmittedListResponse(res)));
    } else {
      return of({
        rows: [],
        nextToken: null
      });
    }
  }

  getFormsListCount$(isArchived: boolean = false): Observable<number> {
    const statement = isArchived
      ? `query {
      listFormLists(limit: ${limit}, filter: {isArchived: {eq: true}, isDeleted: {eq: false}}) {
        items {
          id
        }
      }
    }
    `
      : `query {
      listFormLists(limit: ${limit}, filter: {isArchived: {eq: false},isDeleted: {eq: false}}) {
        items {
          id
        }
      }
    }`;
    return from(API.graphql(graphqlOperation(statement))).pipe(
      map(
        ({ data: { listFormLists } }: any) => listFormLists?.items?.length || 0
      )
    );
  }

  getSubmissionFormsListCount$(): Observable<number> {
    const statement = `query { listFormSubmissionLists(limit: ${limit}) { items { id } } }`;
    return from(API.graphql(graphqlOperation(statement))).pipe(
      map(
        ({ data: { listFormSubmissionLists } }: any) =>
          listFormSubmissionLists?.items?.length || 0
      )
    );
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
    return from(
      this.awsApiService.CreateFormList({
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
      })
    );
  }

  updateForm$(formMetaDataDetails) {
    return from(
      this.awsApiService.UpdateFormList({
        ...formMetaDataDetails.formMetadata,
        _version: formMetaDataDetails.formListDynamoDBVersion
      })
    );
  }

  deleteForm$(values: DeleteFormListInput) {
    return from(this.awsApiService.DeleteFormList({ ...values }));
  }

  getFormById$(id: string) {
    return from(this.awsApiService.GetFormList(id));
  }

  createFormDetail$(formDetails) {
    return from(
      this.awsApiService.CreateFormDetail({
        formlistID: formDetails.formListId,
        formData: this.formatFormData(
          formDetails.formMetadata,
          formDetails.pages
        )
      })
    );
  }

  updateFormDetail$(formDetails) {
    return from(
      this.awsApiService.UpdateFormDetail({
        id: formDetails.formDetailId,
        formlistID: formDetails.formListId,
        formData: this.formatFormData(
          formDetails.formMetadata,
          formDetails.pages
        ),
        _version: formDetails.formDetailDynamoDBVersion
      } as UpdateFormDetailInput)
    );
  }

  createAuthoredFormDetail$(formDetails) {
    return from(
      this.awsApiService.CreateAuthoredFormDetail({
        formStatus: formDetails.formStatus,
        formDetailPublishStatus: formDetails.formDetailPublishStatus,
        formlistID: formDetails.formListId,
        pages: JSON.stringify(formDetails.pages),
        counter: formDetails.counter,
        version: formDetails.authoredFormDetailVersion.toString()
      })
    );
  }

  updateAuthoredFormDetail$(formDetails) {
    return from(
      this.awsApiService.UpdateAuthoredFormDetail(
        {
          formStatus: formDetails.formStatus,
          formDetailPublishStatus: formDetails.formDetailPublishStatus,
          formlistID: formDetails.formListId,
          pages: JSON.stringify(formDetails.pages),
          counter: formDetails.counter,
          id: formDetails.authoredFormDetailId,
          _version: formDetails.authoredFormDetailDynamoDBVersion
        } as UpdateAuthoredFormDetailInput,
        {
          formlistID: { eq: formDetails.formListId },
          version: { eq: formDetails.authoredFormDetailVersion.toString() }
        }
      )
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
    return from(
      this.awsApiService.AuthoredFormDetailsByFormlistID(formId, null, {
        formStatus: { eq: formStatus }
      })
    ).pipe(
      map(({ items }) => {
        items.sort((a, b) => parseInt(b.version, 10) - parseInt(a.version, 10));
        return items[0];
      })
    );
  }

  getAuthoredFormDetailsByFormId$(formId: string) {
    return from(
      this.awsApiService.AuthoredFormDetailsByFormlistID(formId)
    ).pipe(map(({ items }) => items));
  }

  getFormDetailByFormId$(formId: string) {
    return from(this.awsApiService.FormDetailsByFormlistID(formId)).pipe(
      map(({ items }) => items)
    );
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
    const statement = `query { listFormLists(limit: ${limit}) { items { name } } }`;
    return from(API.graphql(graphqlOperation(statement))).pipe(
      map(
        ({ data: { listFormLists } }: any) =>
          listFormLists?.items as GetFormListQuery[]
      )
    );
  }

  getAuthoredFormDetail$(formlistID: string) {
    return from(
      this.awsApiService.AuthoredFormDetailsByFormlistID(formlistID)
    ).pipe(map(({ items }) => items));
  }

  getInspectionDetailByInspectionId$ = (inspectionId: string) =>
    from(this.awsApiService.GetFormSubmissionDetail(inspectionId));

  private formatGraphQLFormsResponse(resp: ListFormListsQuery) {
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

  private async _ListFormSubmissionLists(
    filter?: ModelFormSubmissionListFilterInput,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    limit?: number,
    nextToken?: string
  ): Promise<ListFormSubmissionListsQuery> {
    const statement = `query ListFormSubmissionLists($filter: ModelFormSubmissionListFilterInput, $limit: Int, $nextToken: String) {
        listFormSubmissionLists(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            name
            description
            formLogo
            isPublic
            location
            roundType
            status
            assignee
            dueDate
            version
            submittedBy
            searchTerm
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            formSubmissionListFormSubmissionDetail {
              items {
                _version
                createdAt
                formData
                formlistID
                formsubmissionlistID
                id
                updatedAt
                _lastChangedAt
                _deleted
              }
            }
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return response?.data
      ?.listFormSubmissionLists as ListFormSubmissionListsQuery;
  }

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

  fetchAllForms$ = () =>
    from(this.awsApiService.ListFormLists({}, LIST_LENGTH, ''));

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
fetchAllRounds$ = () => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', '');
    params.set('limit', '2000000');
    params.set('nextToken', '');
    params.set('formId', '');
    params.set('status', '');
    params.set('inspectedBy', '');
    params.set('inspectedOnStartDate', '');
    params.set('inspectedOnEndDate', '');
    return this.appService
      ._getResp(environment.rdfApiUrl, 'inspections?' + params.toString())
      .pipe(map((res) => this.formatInspections(res.rows)));
  };

  getInspectionsList$(
    queryParams: InspectionQueryParam,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<InspectionDetailResponse> {
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
          'inspections',
          { displayToast, failureResponse },
          rest
        )
        .pipe(map((data) => ({ ...data, rows: this.formatInspections(data.rows) })));
    } else {
      return of({
        rows: []
      } as InspectionDetailResponse);
    }
  }


  private formatInspections(rounds: any[] = []): any[] {
    const rows = rounds
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
        dueDate: format(new Date(p.dueDate), 'dd MMM yyyy'),
        tasksCompleted: `0/0,0%`
      }));
    return rows;
  }

}
