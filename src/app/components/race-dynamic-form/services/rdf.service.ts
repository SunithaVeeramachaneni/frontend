/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { API, graphqlOperation } from 'aws-amplify';
import { format, formatDistance } from 'date-fns';
import { BehaviorSubject, from, Observable, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  APIService,
  DeleteFormListInput,
  GetFormListQuery,
  ListFormListsQuery,
  ListFormSubmissionListsQuery,
  ModelFormSubmissionListFilterInput,
  UpdateAuthoredFormDetailInput,
  UpdateFormDetailInput,
  UpdateFormListInput
} from 'src/app/API.service';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import {
  ErrorInfo,
  LoadEvent,
  SearchEvent,
  TableEvent
} from './../../../interfaces';
import { formConfigurationStatus } from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';
import { isJson } from '../utils/utils';

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
    private appService: AppService
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
    isArchived: boolean = false
  ) {
    if (
      ['load', 'search'].includes(queryParams.fetchType) ||
      (['infiniteScroll'].includes(queryParams.fetchType) &&
        queryParams.nextToken !== null)
    ) {
      const isSearch = queryParams.fetchType === 'search';
      return from(
        this.awsApiService.ListFormLists(
          {
            ...(queryParams.searchKey && {
              searchTerm: { contains: queryParams?.searchKey.toLowerCase() }
            }),
            isArchived: {
              eq: isArchived
            }
          },
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
      listFormLists(limit: ${limit}, filter: {isArchived: {eq: true}}) {
        items {
          id
        }
      }
    }
    `
      : `query {
      listFormLists(limit: ${limit}, filter: {isArchived: {eq: false}}) {
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
        isArchived: false
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
      this.awsApiService.UpdateAuthoredFormDetail({
        formStatus: formDetails.formStatus,
        formDetailPublishStatus: formDetails.formDetailPublishStatus,
        formlistID: formDetails.formListId,
        pages: JSON.stringify(formDetails.pages),
        counter: formDetails.counter,
        id: formDetails.authoredFormDetailId,
        _version: formDetails.authoredFormDetailDynamoDBVersion
      } as UpdateAuthoredFormDetailInput)
    );
  }

  getResponseSet$(queryParams: {
    nextToken?: string;
    limit?: number;
    responseType: string;
  }) {
    if (queryParams.nextToken !== null) {
      return from(
        this.awsApiService.ListResponseSets(
          {
            type: { eq: queryParams.responseType }
          },
          queryParams.limit,
          queryParams.nextToken
        )
      );
    }
  }

  createResponseSet$(responseSet) {
    return from(
      this.awsApiService.CreateResponseSet({
        type: responseSet.responseType,
        name: responseSet.name,
        description: responseSet?.description,
        isMultiColumn: responseSet.isMultiColumn,
        values: responseSet.values
      })
    );
  }

  updateResponseSet$(responseSet) {
    return from(
      this.awsApiService.UpdateResponseSet({
        id: responseSet.id,
        type: responseSet.responseType,
        name: responseSet.name,
        description: responseSet.description,
        isMultiColumn: responseSet.isMultiColumn,
        values: responseSet.values,
        _version: responseSet.version
      })
    );
  }

  deleteResponseSet$(responseSetId: string) {
    return from(
      this.awsApiService.DeleteResponseSet({
        id: responseSetId
      })
    );
  }

  getAuthoredFormDetailByFormId$(formId: string) {
    return from(
      this.awsApiService.AuthoredFormDetailsByFormlistID(formId, null, {
        or: [
          {
            formStatus: { eq: formConfigurationStatus.draft }
          },
          {
            formStatus: { eq: formConfigurationStatus.published }
          }
        ]
      })
    ).pipe(map(({ items }) => items));
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

      const logicQuestions = questions.filter((question) => {
        let resp = false;
        logics.forEach((logic) => {
          if (question.sectionId === `AQ_${logic.id}`) {
            resp = true;
          }
        });
        return resp;
      });
      const pageItem = {
        SECTIONS: sections.map((section) => {
          let questionsBySection = questions.filter(
            (item) => item.sectionId === section.id
          );
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
                  questions,
                  logics
                ),
                MANDATORY: question.required === true ? 'X' : ''
              };

              if (question.fieldType === 'ARD') {
                Object.assign(questionItem, { SUBFORMNAME: question.name }); // Might be name or id.
                arrayFieldTypeQuestions.push(question);
              }

              if (question.fieldType === 'VI' || question.fieldType === 'DD') {
                const viVALUE = question.value?.value.map((item, idx) => ({
                  [`label${idx + 1}`]: item.title,
                  key: item.title,
                  color: item.color,
                  description: item.title
                }));
                questionItem.UIFIELDTYPE = question.multi
                  ? 'DDM'
                  : question.fieldType;
                Object.assign(questionItem, {
                  DDVALUE: viVALUE
                });
              }

              if (question.fieldType === 'RT') {
                const { min, max, increment } = question.value;
                questionItem.DEFAULTVALUE = `${min},${max},${increment}`;
              }

              if (question.fieldType === 'LF') {
                questionItem.DEFAULTVALUE = question.value;
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

  getValidationExpression(questionId, questions, logics) {
    let expression = '';
    let globalIndex = 0;
    const questionLogics = logics.filter(
      (logic) => logic.questionId === questionId
    );
    if (!questionLogics || !questionLogics.length) return expression;

    questionLogics.forEach((logic) => {
      const isEmpty = !logic.operand2.length;

      // Mandate Questions;
      const mandatedQuestions = logic.mandateQuestions;
      if (mandatedQuestions && mandatedQuestions.length) {
        mandatedQuestions.forEach((mq) => {
          globalIndex = globalIndex + 1;
          if (isEmpty) {
            expression = `${expression};${globalIndex}:(E) ${mq} EQ MANDIT IF ${questionId} ${logic.operator} EMPTY`;
          } else {
            expression = `${expression};${globalIndex}:(E) ${mq} EQ MANDIT IF ${questionId} ${logic.operator} (V)${logic.operand2}`;
          }
        });
      }

      // Hide Questions;
      const hiddenQuestions = logic.hideQuestions;
      if (hiddenQuestions && hiddenQuestions.length) {
        hiddenQuestions.forEach((hq) => {
          globalIndex = globalIndex + 1;
          if (isEmpty) {
            expression = `${expression};${globalIndex}:(HI) ${hq} IF ${questionId} ${logic.operator} EMPTY`;
          } else {
            expression = `${expression};${globalIndex}:(HI) ${hq} IF ${questionId} ${logic.operator} (V)${logic.operand2}`;
          }
        });
      }

      // Ask Questions;
      const askQuestions = questions.filter(
        (q) => q.sectionId === `AQ_${logic.id}`
      );
      askQuestions.forEach((q) => {
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
          publishedDate: p.publishedDate
            ? formatDistance(new Date(p.publishedDate), new Date(), {
                addSuffix: true
              })
            : '',
          archivedAt: p.createdAt
            ? formatDistance(new Date(p.createdAt), new Date(), {
                addSuffix: true
              })
            : ''
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
              image: p?.formLogo,
              style: {
                width: '40px',
                height: '40px',
                marginRight: '10px'
              },
              condition: true
            },
            responses,
            createdAt: format(new Date(p?.createdAt), 'Do MMM'),
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
}
