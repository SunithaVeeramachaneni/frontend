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
  DeleteRoundPlanListInput,
  GetRoundPlanListQuery,
  ListRoundPlanListsQuery,
  UpdateAuthoredRoundPlanDetailInput,
  UpdateFormDetailInput,
  ListRoundPlanSubmissionListsQuery,
  ModelRoundPlanSubmissionListFilterInput
} from 'src/app/API.service';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import {
  ErrorInfo,
  LoadEvent,
  SearchEvent,
  TableEvent
} from '../../../interfaces';
import { Store } from '@ngrx/store';
import { formConfigurationStatus } from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';
import { oppositeOperatorMap } from 'src/app/shared/utils/fieldOperatorMappings';
import { getResponseSets } from 'src/app/forms/state';
import { isJson } from '../../race-dynamic-form/utils/utils';
import { AssetHierarchyUtil } from 'src/app/shared/utils/assetHierarchyUtil';

const limit = 10000;
@Injectable({
  providedIn: 'root'
})
export class OperatorRoundsService {
  private selectedNodeSubject = new BehaviorSubject<any>({});
  private hierarchyModeSubject = new BehaviorSubject<any>('asset_hierarchy');

  private formCreatedUpdatedSubject = new BehaviorSubject<any>({});
  fetchForms$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);

  formCreatedUpdated$ = this.formCreatedUpdatedSubject.asObservable();
  selectedNode$ = this.selectedNodeSubject.asObservable();
  hierarchyMode$ = this.hierarchyModeSubject.asObservable();

  constructor(
    public assetHierarchyUtil: AssetHierarchyUtil,
    private readonly awsApiService: APIService,
    private toastService: ToastService,
    private appService: AppService,
    private store: Store
  ) {}

  setSelectedNode(node: any) {
    this.selectedNodeSubject.next(node);
  }
  setHierarchyMode(mode: string) {
    this.hierarchyModeSubject.next(mode);
  }

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
    formStatus: 'Published' | 'Draft' | 'All',
    isArchived: boolean = false
  ) {
    if (
      ['load', 'search'].includes(queryParams.fetchType) ||
      (['infiniteScroll'].includes(queryParams.fetchType) &&
        queryParams.nextToken !== null)
    ) {
      const isSearch = queryParams.fetchType === 'search';
      return from(
        this.awsApiService.ListRoundPlanLists(
          {
            ...(queryParams.searchKey && {
              searchTerm: { contains: queryParams?.searchKey.toLowerCase() }
            }),
            isArchived: {
              eq: isArchived
            },
            ...(formStatus !== 'All' && {
              formStatus: {
                eq: formStatus
              }
            }),
            isDeleted: {
              eq: false
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

  getRoundsList$(queryParams: {
    nextToken?: string;
    limit: number;
    searchKey: string;
    fetchType: string;
  }) {
    return of({
      count: 0,
      rows: [],
      nextToken: null
    });
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

  getFormsListCount$(
    formStatus: 'Published' | 'Draft' | 'All',
    isArchived: boolean = false
  ): Observable<number> {
    const statement = `query {
      listRoundPlanLists(limit: ${limit}, filter: { isArchived: { eq: ${isArchived} } , isDeleted: { eq: false } ${
      formStatus !== 'All' ? `, formStatus: { eq: "${formStatus}" }` : ''
    }}) {
        items {
          id
        }
      }
    }`;

    return from(API.graphql(graphqlOperation(statement))).pipe(
      map(
        ({ data: { listRoundPlanLists } }: any) =>
          listRoundPlanLists?.items?.length || 0
      )
    );
  }

  getRoundsListCount$(): Observable<number> {
    return of(0);
  }

  getSubmissionFormsListCount$(): Observable<number> {
    const statement = `query { listRoundPlanSubmissionLists(limit: ${limit}) { items { id } } }`;
    return from(API.graphql(graphqlOperation(statement))).pipe(
      map(
        ({ data: { listRoundPlanSubmissionLists } }: any) =>
          listRoundPlanSubmissionLists?.items?.length || 0
      )
    );
  }

  createForm$(
    formListQuery: Pick<
      GetRoundPlanListQuery,
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
      this.awsApiService.CreateRoundPlanList({
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
    const { hierarchy, ...formMetadata } = formMetaDataDetails.formMetadata;
    return from(
      this.awsApiService.UpdateRoundPlanList({
        ...formMetadata,
        _version: formMetaDataDetails.formListDynamoDBVersion
      })
    );
  }

  deleteForm$(values: DeleteRoundPlanListInput) {
    return from(this.awsApiService.DeleteRoundPlanList({ ...values }));
  }

  getFormById$(id: string) {
    return from(this.awsApiService.GetRoundPlanList(id));
  }

  createFormDetail$(formDetails) {
    const flatHierarchy = this.assetHierarchyUtil.convertHierarchyToFlatList(
      formDetails.hierarchy,
      0
    );

    return from(
      this.awsApiService.CreateRoundPlanDetail({
        formlistID: formDetails.formListId,
        formData: this.formatFormData(formDetails),
        flatHierarchy: JSON.stringify(flatHierarchy)
      })
    );
  }

  updateFormDetail$(formDetails) {
    const flatHierarchy = this.assetHierarchyUtil.convertHierarchyToFlatList(
      formDetails.hierarchy,
      0
    );
    return from(
      this.awsApiService.UpdateRoundPlanDetail({
        id: formDetails.formDetailId,
        formlistID: formDetails.formListId,
        formData: this.formatFormData(formDetails),
        flatHierarchy: JSON.stringify(flatHierarchy),
        _version: formDetails.formDetailDynamoDBVersion
      } as UpdateFormDetailInput)
    );
  }

  createAuthoredFormDetail$(formDetails) {
    return from(
      this.awsApiService.CreateAuthoredRoundPlanDetail({
        formStatus: formDetails.formStatus,
        formDetailPublishStatus: formDetails.formDetailPublishStatus,
        formlistID: formDetails.formListId,
        subForms: JSON.stringify(formDetails.subForms),
        pages: JSON.stringify(formDetails.pages),
        counter: formDetails.counter,
        version: formDetails.authoredFormDetailVersion.toString(),
        hierarchy: JSON.stringify(formDetails.hierarchy)
      })
    );
  }

  updateAuthoredFormDetail$(formDetails) {
    return from(
      this.awsApiService.UpdateAuthoredRoundPlanDetail(
        {
          formStatus: formDetails.formStatus,
          formDetailPublishStatus: formDetails.formDetailPublishStatus,
          formlistID: formDetails.formListId,
          pages: JSON.stringify(formDetails.pages),
          subForms: JSON.stringify(formDetails.subForms),
          counter: formDetails.counter,
          id: formDetails.authoredFormDetailId,
          _version: formDetails.authoredFormDetailDynamoDBVersion,
          hierarchy: JSON.stringify(formDetails.hierarchy)
        } as UpdateAuthoredRoundPlanDetailInput,
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

  getAuthoredFormDetailByFormId$(
    formId: string,
    formStatus: string = formConfigurationStatus.draft
  ) {
    return from(
      this.awsApiService.AuthoredRoundPlanDetailsByFormlistID(formId, null, {
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
      this.awsApiService.AuthoredRoundPlanDetailsByFormlistID(formId)
    ).pipe(map(({ items }) => items));
  }

  getFormDetailByFormId$(formId: string) {
    return from(this.awsApiService.RoundPlanDetailsByFormlistID(formId)).pipe(
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

  formatFormData = (formDetails): string => {
    const { formMetadata } = formDetails;

    let subFormKeys = Object.keys(formDetails);
    subFormKeys = subFormKeys.filter((key) => key.startsWith('pages'));
    const forms = [];
    subFormKeys.forEach((key) => {
      const pages = formDetails[key];
      if (!pages || !pages.length) {
        return;
      }
      let nodeId = '';
      if (key.startsWith('pages_')) {
        nodeId = key.replace('pages_', '');
      } else {
        nodeId = key.replace('pages', '');
      }
      const arrayFieldTypeQuestions = [];
      const formData = {
        FORMNAME: nodeId, //formMetadata.name,
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
                  if (
                    question.rangeMetadata.min &&
                    question.rangeMetadata.max
                  ) {
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
                          responses.find(
                            (item) => item.id === question.value.id
                          )?.values
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

                return questionItem;
              })
            };

            return sectionItem;
          })
        };

        return pageItem;
      });

      forms.push(formData);
    });
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
    const statement = `query { listRoundPlanLists(limit: ${limit}) { items { name } } }`;
    return from(API.graphql(graphqlOperation(statement))).pipe(
      map(
        ({ data: { listRoundPlanLists } }: any) =>
          listRoundPlanLists?.items as GetRoundPlanListQuery[]
      )
    );
  }

  getAuthoredFormDetail$(formlistID: string) {
    return from(
      this.awsApiService.AuthoredRoundPlanDetailsByFormlistID(formlistID)
    ).pipe(map(({ items }) => items));
  }

  getInspectionDetailByInspectionId$ = (inspectionId: string) =>
    from(this.awsApiService.GetFormSubmissionDetail(inspectionId));

  private formatGraphQLFormsResponse(resp: ListRoundPlanListsQuery) {
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

  private formatSubmittedListResponse(resp: ListRoundPlanSubmissionListsQuery) {
    const rows =
      resp.items
        .sort(
          (a, b) =>
            new Date(b?.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        ?.map((p: any) => {
          let responses = '0/0';
          if (p?.RoundPlanSubmissionDetails?.items?.length > 0) {
            p?.RoundPlanSubmissionDetails?.items.forEach((form) => {
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
    filter?: ModelRoundPlanSubmissionListFilterInput,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    limit?: number,
    nextToken?: string
  ): Promise<ListRoundPlanSubmissionListsQuery> {
    const statement = `query ListRoundPlanSubmissionLists($filter: ModelRoundPlanSubmissionListFilterInput, $limit: Int, $nextToken: String) {
      listRoundPlanSubmissionLists(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
          RoundPlanSubmissionDetails {
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
      ?.listRoundPlanSubmissionLists as ListRoundPlanSubmissionListsQuery;
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
