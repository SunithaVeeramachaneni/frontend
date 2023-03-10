/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { format, formatDistance } from 'date-fns';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import {
  ErrorInfo,
  LoadEvent,
  RoundPlanList,
  RoundPlanSubmissionList,
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
      limit: any;
      searchKey: string;
      fetchType: string;
    },
    formStatus: 'Published' | 'Draft' | 'All',
    isArchived: boolean = false
  ) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', queryParams?.searchKey);
    params.set('limit', queryParams?.limit);
    params.set('nextToken', queryParams?.nextToken);
    params.set('fetchType', queryParams?.fetchType);
    params.set('formStatus', formStatus);
    params.set('isArchived', String(isArchived));
    return this.appService
      ._getResp(
        environment.operatorRoundsApiUrl,
        'round-plans?' + params.toString()
      )
      .pipe(map((res) => this.formateGetRoundPlanResponse(res)));
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
    limit: any;
    searchKey: string;
    fetchType: string;
  }) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', queryParams?.searchKey);
    params.set('limit', queryParams?.limit);
    params.set('nextToken', queryParams?.nextToken);
    params.set('fetchType', queryParams?.fetchType);
    return this.appService
      ._getResp(
        environment.operatorRoundsApiUrl,
        'round-plans/submissions?' + params.toString()
      )
      .pipe(map((res) => this.formatSubmittedListResponse(res)));
  }

  getFormsListCount$(
    formStatus: 'Published' | 'Draft' | 'All',
    isArchived: boolean = false
  ): Observable<number> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('formStatus', formStatus);
    params.set('limit', String(limit));
    params.set('isArchived', String(isArchived));
    return this.appService
      ._getResp(
        environment.operatorRoundsApiUrl,
        'round-plans/count?' + params.toString()
      )
      .pipe(map(({ count }) => count || 0));
  }

  getRoundsListCount$(): Observable<number> {
    return of(0);
  }

  getSubmissionFormsListCount$(): Observable<number> {
    return this.appService
      ._getResp(
        environment.operatorRoundsApiUrl,
        'round-plans/submissions/count'
      )
      .pipe(map(({ count }) => count || 0));
  }

  createForm$(formListQuery) {
    return this.appService._postData(
      environment.operatorRoundsApiUrl,
      'round-plans',
      {
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
      }
    );
  }

  updateForm$(formMetaDataDetails) {
    const { hierarchy, ...formMetadata } = formMetaDataDetails.formMetadata;
    return this.appService.patchData(
      environment.operatorRoundsApiUrl,
      `round-plans/${formMetaDataDetails?.formMetadata?.id}`,
      {
        ...formMetadata,
        _version: formMetaDataDetails.formListDynamoDBVersion
      }
    );
  }

  getFormDetailsById$(id: string) {
    return this.appService._getResp(
      environment.operatorRoundsApiUrl,
      `round-plans/${id}`
    );
  }

  createAuthoredFormDetail$(formDetails) {
    const {
      hierarchy,
      subForms,
      counter,
      pages,
      formListId,
      formDetailPublishStatus,
      formStatus
    } = formDetails;
    const flatHierarchy = this.assetHierarchyUtil.convertHierarchyToFlatList(
      JSON.parse(JSON.stringify(hierarchy)),
      0
    );
    return this.appService._postData(
      environment.operatorRoundsApiUrl,
      'round-plans/authored',
      {
        formStatus,
        formDetailPublishStatus,
        formlistID: formListId,
        pages: JSON.stringify(pages),
        counter,
        flatHierarchy,
        subForms,
        hierarchy,
        version: formDetails.authoredFormDetailVersion.toString()
      }
    );
  }

  publishRoundPlan$(roundPlanDetails) {
    const { hierarchy } = roundPlanDetails.authoredFormDetail;
    const flatHierarchy = this.assetHierarchyUtil.convertHierarchyToFlatList(
      JSON.parse(JSON.stringify(hierarchy)),
      0
    );
    return this.appService.patchData(
      environment.operatorRoundsApiUrl,
      `round-plans/publish/${roundPlanDetails.form.id}`,
      {
        ...roundPlanDetails,
        authoredFormDetail: {
          ...roundPlanDetails.authoredFormDetail,
          flatHierarchy
        }
      }
    );
  }

  updateAuthoredFormDetail$(formDetails) {
    const {
      hierarchy,
      subForms,
      counter,
      pages,
      formListId,
      formDetailPublishStatus,
      formStatus
    } = formDetails;
    const flatHierarchy = this.assetHierarchyUtil.convertHierarchyToFlatList(
      JSON.parse(JSON.stringify(hierarchy)),
      0
    );
    return this.appService.patchData(
      environment.operatorRoundsApiUrl,
      `round-plans/authored/${formDetails.authoredFormDetailId}`,
      {
        formStatus,
        formDetailPublishStatus,
        formlistID: formListId,
        subForms,
        pages: JSON.stringify(pages),
        counter,
        hierarchy,
        flatHierarchy,
        _version: formDetails.authoredFormDetailDynamoDBVersion,
        version: formDetails.authoredFormDetailVersion.toString()
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

  copyRoundPlan$(formId: string) {
    return this.appService.patchData(
      environment.operatorRoundsApiUrl,
      `round-plans/copy`,
      {
        formId
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
    return this.appService._getResp(
      environment.operatorRoundsApiUrl,
      `round-plans/authored/${formId}?` + params.toString()
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

  private formateGetRoundPlanResponse(resp: RoundPlanList) {
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

  private formatSubmittedListResponse(resp: RoundPlanSubmissionList) {
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
