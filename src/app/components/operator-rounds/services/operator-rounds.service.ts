/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { format, formatDistance } from 'date-fns';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import {
  ErrorInfo,
  LoadEvent,
  RoundPlan,
  RoundPlanList,
  RoundPlanSubmissionList,
  SearchEvent,
  TableEvent,
  RoundPlanDetailResponse,
  RoundDetailResponse,
  RoundDetail,
  RoundPlanQueryParam,
  UserDetails,
  UsersInfoByEmail,
  Count
} from '../../../interfaces';
import { formConfigurationStatus } from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';
import { oppositeOperatorMap } from 'src/app/shared/utils/fieldOperatorMappings';
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
  usersInfoByEmail: UsersInfoByEmail;
  isEdit = location?.pathname?.startsWith('/operator-rounds/edit/');
  constructor(
    public assetHierarchyUtil: AssetHierarchyUtil,
    private toastService: ToastService,
    private appService: AppService
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
      next?: string;
      limit: any;
      searchKey: string;
      fetchType: string;
    },
    formStatus: 'Published' | 'Draft' | 'All',
    isArchived: boolean = false,
    filterData: any = null
  ) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', queryParams?.searchKey);
    params.set('limit', queryParams?.limit);
    params.set('next', queryParams?.next);
    params.set('fetchType', queryParams?.fetchType);
    params.set('formStatus', formStatus);
    params.set('isArchived', String(isArchived));
    if (filterData) {
      params.set(
        'formStatus',
        filterData.status ? filterData.status : formStatus
      );
      params.set('modifiedBy', filterData.modifiedBy ?? '');
      params.set('authoredBy', filterData.authoredBy ?? '');
      params.set('plantId', filterData.plant ?? '');
      params.set('createdBy', filterData.createdBy ?? '');
      params.set('lastModifiedOn', filterData.lastModifiedOn ?? '');
      params.set(
        'scheduleStartDate',
        filterData.scheduleStartDate ? filterData.scheduleStartDate : ''
      );
      params.set(
        'scheduleEndDate',
        filterData.scheduleEndDate ? filterData.scheduleEndDate : ''
      );
    }
    return this.appService
      ._getResp(
        environment.operatorRoundsApiUrl,
        'round-plans?' + params.toString()
      )
      .pipe(map((res) => this.formateGetRoundPlanResponse(res)));
  }

  getRoundsList$(
    queryParams: RoundPlanQueryParam,
    filterData: any = null,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<RoundDetailResponse> {
    const { fetchType, ...rest } = queryParams;
    if (
      ['load', 'search'].includes(queryParams.fetchType) ||
      (['infiniteScroll'].includes(queryParams.fetchType) &&
        queryParams.next !== null)
    ) {
      const isSearch = fetchType === 'search';
      if (isSearch) {
        rest.next = '';
      }
      let queryParamaters: any = rest;
      if (filterData) {
        queryParamaters = { ...rest, plantId: filterData.plant };
      }
      const { displayToast, failureResponse = {} } = info;
      return this.appService
        ._getResp(
          environment.operatorRoundsApiUrl,
          'rounds/',
          { displayToast, failureResponse },
          queryParamaters
        )
        .pipe(
          map((data) => ({ ...data, rows: this.formatRounds(data.items) }))
        );
    } else {
      return of({
        rows: []
      } as RoundDetailResponse);
    }
  }

  getRoundsCountByRoundPlanId$ = (
    roundPlanId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Count> =>
    this.appService._getRespById(
      environment.operatorRoundsApiUrl,
      'rounds/',
      `${roundPlanId}/count`,
      info
    );

  getPlansList$(
    queryParams: RoundPlanQueryParam,
    filterData: any = null,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<RoundPlanDetailResponse> {
    const { fetchType } = queryParams;
    if (
      ['load', 'search'].includes(fetchType) ||
      (['infiniteScroll'].includes(fetchType) && queryParams.next !== null)
    ) {
      const queryParamaters = queryParams;
      if (filterData) {
        Object.assign(queryParamaters, { plantId: filterData.plant });
      }
      const { displayToast, failureResponse = {} } = info;
      return this.appService
        ._getResp(
          environment.operatorRoundsApiUrl,
          'round-plans/tasks-rounds',
          { displayToast, failureResponse },
          queryParamaters
        )
        .pipe(
          map((data) => ({ ...data, rows: this.formatRoundPlans(data.items) }))
        );
    } else {
      return of({ rows: [] } as RoundPlanDetailResponse);
    }
  }

  getSubmissionFormsList$(queryParams: {
    next?: string;
    limit: any;
    searchKey: string;
    fetchType: string;
  }) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', queryParams?.searchKey);
    params.set('limit', queryParams?.limit);
    params.set('next', queryParams?.next);
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
        plantId: formListQuery.plantId,
        isArchived: false,
        isDeleted: false,
        pdfTemplateConfiguration: formListQuery.pdfTemplateConfiguration
      }
    );
  }

  updateForm$(formMetaDataDetails) {
    const { hierarchy, plant, moduleName, ...formMetadata } =
      formMetaDataDetails.formMetadata;
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
    return this.appService._getRespById(
      environment.operatorRoundsApiUrl,
      `round-plans/`,
      id
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
    roundPlanDetails.authoredFormDetail.formStatus =
      roundPlanDetails.form.formStatus;
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
        },
        isEdit: location?.pathname?.startsWith('/operator-rounds/edit/')
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

  copyRoundPlan$(formId: string) {
    return this.appService._postData(
      environment.operatorRoundsApiUrl,
      `round-plans/copy`,
      {
        formId
      }
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
    const next = resp?.next;
    return {
      count,
      rows,
      next
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

  private formatRoundPlans(roundPlans: RoundPlan[] = []): RoundPlan[] {
    const rows = roundPlans
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
        lastPublishedBy: p.lastPublishedBy,
        author: p.author,
        publishedDate: p.publishedDate ? p.publishedDate : ''
      }));
    return rows;
  }

  private formatRounds(rounds: RoundDetail[] = []): RoundDetail[] {
    const rows = rounds
      .sort(
        (a, b) =>
          new Date(a?.dueDate).getTime() - new Date(b?.dueDate).getTime()
      )
      .map((p) => ({
        ...p,
        preTextImage: {
          image: 'assets/img/svg/rounds-icon.svg',
          style: {
            width: '40px',
            height: '40px',
            marginRight: '10px'
          },
          condition: true
        },
        dueDate: p.dueDate ? format(new Date(p.dueDate), 'dd MMM yyyy') : '',
        locationAssetsCompleted: `${p.locationAndAssetsCompleted}/${p.locationAndAssets}`,
        tasksCompleted: `${p.locationAndAssetTasksCompleted}/${
          p.locationAndAssetTasks
        },${
          p.locationAndAssetTasks > 0
            ? Math.round(
                (Math.abs(
                  p.locationAndAssetTasksCompleted / p.locationAndAssetTasks
                ) +
                  Number.EPSILON) *
                  100
              )
            : 0
        }%`,
        roundId: p.roundId
      }));
    return rows;
  }

  fetchAllOperatorRounds$ = () => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', '');
    params.set('limit', '2000000');
    params.set('next', '');
    params.set('fetchType', '');
    params.set('formStatus', 'All');
    params.set('isArchived', 'false');
    return this.appService
      ._getResp(
        environment.operatorRoundsApiUrl,
        'round-plans?' + params.toString(),
        { displayToast: true, failureResponse: {} }
      )
      .pipe(map((res) => this.formateGetRoundPlanResponse(res)));
  };

  fetchAllRounds$ = () => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', '');
    params.set('limit', '2000000');
    params.set('next', '');
    params.set('roundPlanId', '');
    params.set('status', '');
    params.set('assignedTo', '');
    params.set('dueDate', '');

    return this.appService
      ._getResp(
        environment.operatorRoundsApiUrl,
        'rounds?' + params.toString(),
        { displayToast: true, failureResponse: {} }
      )
      .pipe(map((res) => this.formatRounds(res?.items || [])));
  };

  fetchAllPlansList$ = () => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', '');
    params.set('limit', '2000000');
    params.set('next', '');
    params.set('roundPlanId', '');
    params.set('status', '');
    params.set('assignedTo', '');
    params.set('dueDate', '');

    return this.appService
      ._getResp(environment.operatorRoundsApiUrl, 'round-plans/tasks-rounds', {
        displayToast: true,
        failureResponse: {}
      })
      .pipe(
        map((data) => ({ ...data, rows: this.formatRoundPlans(data?.items) }))
      );
  };

  fetchAllArchivedPlansList$ = () => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', '');
    params.set('limit', '2000000');
    params.set('next', '');
    params.set('fetchType', '');
    params.set('formStatus', 'All');
    params.set('isArchived', 'true');
    return this.appService
      ._getResp(
        environment.operatorRoundsApiUrl,
        'round-plans?' + params.toString(),
        { displayToast: true, failureResponse: {} }
      )
      .pipe(map((res) => this.formateGetRoundPlanResponse(res)));
  };

  getFilter(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this.appService._getLocal(
      '',
      'assets/json/operator-rounds-filter.json',
      info
    );
  }
  getPlanFilter(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this.appService._getLocal(
      '',
      'assets/json/operator-rounds-plan-filter.json',
      info
    );
  }
  getRoundFilter(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this.appService._getLocal(
      '',
      'assets/json/operator-rounds-round-filter.json',
      info
    );
  }
  getArchivedFilter(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this.appService._getLocal(
      '',
      'assets/json/operator-rounds-archived-filter.json',
      info
    );
  }

  updateRound$ = (
    roundId: string,
    round: RoundDetail,
    type: 'due-date' | 'assigned-to',
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<RoundDetail> =>
    this.appService
      .patchData(
        environment.operatorRoundsApiUrl,
        `rounds/${roundId}/${type}`,
        round,
        info
      )
      .pipe(map((response) => (response === null ? round : response)));

  downloadAttachment$ = (
    roundPlanId: string,
    roundId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Blob> => {
    const apiURL = `${environment.operatorRoundsApiUrl}rounds/${roundPlanId}/${roundId}`;
    return this.appService.downloadFile(
      apiURL,
      '',
      info,
      true,
      {},
      'arraybuffer'
    );
  };
}
