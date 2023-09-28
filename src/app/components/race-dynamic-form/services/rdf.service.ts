/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { Injectable, NgZone } from '@angular/core';
import { format, formatDistance } from 'date-fns';
import { BehaviorSubject, from, Observable, of, ReplaySubject } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import {
  ErrorInfo,
  InspectionDetailResponse,
  Form,
  FormQueryParam,
  LoadEvent,
  SearchEvent,
  TableEvent,
  Count,
  InspectionDetail
} from './../../../interfaces';

import {
  formConfigurationStatus,
  LIST_LENGTH,
  dateFormat2,
  graphQLDefaultMaxLimit
} from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';
import { isJson } from '../utils/utils';
import { oppositeOperatorMap } from 'src/app/shared/utils/fieldOperatorMappings';
import { GetFormList } from 'src/app/interfaces/master-data-management/forms';
import { cloneDeep, isEmpty, omitBy } from 'lodash-es';
import { Column } from '@innovapptive.com/dynamictable/lib/interfaces';
import { SseService } from 'src/app/shared/services/sse.service';

const VALIDFROM = '20221002135512';
const VALIDTO = '99991230183000';
const VERSION = '001';
const APPNAME = 'MWORKORDER';
@Injectable({
  providedIn: 'root'
})
export class RaceDynamicFormService {
  fetchForms$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  attachmentsMapping$ = new BehaviorSubject<any>({});
  pdfMapping$ = new BehaviorSubject<any>({});
  redirectToFormsList$ = new BehaviorSubject<boolean>(false);
  embeddedFormId;

  constructor(
    private toastService: ToastService,
    private appService: AppService,
    private sseService: SseService,
    private zone: NgZone
  ) {}

  /**
   * Get event source (SSE)
   */
  private getServerSentEvent(
    apiUrl: string,
    urlString: string,
    data: FormData,
    requestId: string
  ): Observable<any> {
    return new Observable((observer) => {
      const eventSource = this.sseService.getEventSourceWithPost(
        apiUrl,
        urlString,
        data
      );
      // Launch query
      eventSource.stream();
      // on answer from message listener
      eventSource.onmessage = (event) => {
        this.zone.run(() => {
          observer.next({ requestId, ...JSON.parse(event.data) });
        });
      };
      eventSource.onerror = (event) => {
        this.zone.run(() => {
          if (event.data) {
            observer.error({ requestId, error: event.data });
          }
        });
      };
    });
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
  uploadAttachments$(file, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    return this.appService._postData(
      environment.rdfApiUrl,
      `upload-attachments`,
      file,
      info
    );
  }
  getAttachmentsById$(id, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    return this.appService._getResp(
      environment.rdfApiUrl,
      `upload-attachments/${id}`,
      info
    );
  }
  getDataSetsByType$ = (
    datasetType: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any[]> =>
    this.appService._getResp(
      environment.rdfApiUrl,
      `datasets/${datasetType}`,
      info
    );

  getAdditionalDetails$ = (
    data,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any[]> =>
    this.appService._getResp(
      environment.operatorRoundsApiUrl,
      `additional-details/${data.type}/${data.level}`,
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

  getFormsForScheduler$(
    queryParams: FormQueryParam,
    filterData: any = null,
    info: ErrorInfo = {} as ErrorInfo
  ) {
    const { fetchType } = queryParams;
    if (
      ['load', 'search'].includes(fetchType) ||
      (['infiniteScroll'].includes(fetchType) && queryParams.next !== null)
    ) {
      const queryParameters = Object.fromEntries(
        Object.entries({
          ...filterData,
          ...queryParams,
          plantId: filterData?.plant
        }).filter(([k, v]) => k === 'next' || v !== '')
      );
      const { displayToast, failureResponse = {} } = info;
      return this.appService
        ._getResp(
          environment.rdfApiUrl,
          'forms/schedule-forms',
          { displayToast, failureResponse },
          queryParameters
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
      '/assets/json/rdf-form-filter.json',
      info
    );
  }

  getTemplateFilter(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this.appService._getLocal(
      '',
      '/assets/json/template-filter.json',
      info
    );
  }

  getCreateFromTemplateFilter(
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any[]> {
    return this.appService._getLocal(
      '',
      '/assets/json/create-from-template-filter.json',
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
    const rawParams = {
      searchTerm: queryParams?.searchKey,
      limit: queryParams?.limit.toString(),
      isArchived: String(isArchived),
      formStatus: filterData?.status,
      modifiedBy: filterData?.modifiedBy,
      createdBy: filterData?.createdBy,
      lastModifiedOn: filterData?.lastModifiedOn,
      plantId: filterData?.plant,
      formType: filterData?.formType,
      publishedBy: filterData.publishedBy
    };
    const params = new URLSearchParams({
      next: queryParams.next,
      ...omitBy(rawParams, isEmpty)
    });

    return this.appService
      ._getResp(environment.rdfApiUrl, 'forms?' + params.toString(), {
        displayToast: true,
        failureResponse: {}
      })
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
      | 'instructions'
      | 'additionalDetails'
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
      additionalDetails: formListQuery.additionalDetails,
      instructions: formListQuery.instructions,
      isArchived: false,
      isDeleted: false
    });
  }

  updateForm$(formMetaDataDetails) {
    const { plant, embeddedFormId, ...formMetadata } =
      formMetaDataDetails.formMetadata;
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
  ): Observable<Blob> =>
    this.appService.downloadFile(
      environment.rdfApiUrl,
      `inspections/download-pdf/${formId}/${inspectionId}`,
      info,
      true,
      {},
      'arraybuffer'
    );

  getFormById$(
    id: string,
    queryParams: { includeAttachments: boolean },
    info: ErrorInfo = {} as ErrorInfo
  ) {
    return this.appService._getRespById(
      environment.rdfApiUrl,
      `forms/list/`,
      id,
      info,
      queryParams.toString()
    );
  }

  createAuthoredFormDetail$(formDetails) {
    return this.appService._postData(environment.rdfApiUrl, `forms/authored`, {
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

  publishAuthoredFormDetail$(formDetails) {
    return this.appService.patchData(
      environment.rdfApiUrl,
      `forms/authored/publish/${formDetails.formlistID}`,
      formDetails
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
    ).pipe(map(({ items }) => (items.length ? items[0] : {})));
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

  getValidationExpression(questionId, question, questions, logics): any {
    let expression = '';
    const validationMessage = '';
    let notificationExpression = '';
    let globalIndex = 0;
    let askQuestions = [];
    let evidenceQuestions = [];
    let notificationGlobalIndex = 0;
    const logicsT = cloneDeep(logics);
    const questionLogics = logicsT.filter(
      (logic) => logic.questionId === questionId
    );
    if (!questionLogics || !questionLogics.length) return expression;

    const fieldType = question.fieldType;

    questionLogics.forEach((logic) => {
      const logicIsEmpty = !logic.operand2.length;

      if (fieldType === 'CB') {
        logic.operand2 = logic.operand2 ? 'X' : '';
      }

      // Mandate Questions;
      const mandatedQuestions = logic.mandateQuestions;
      if (mandatedQuestions && mandatedQuestions.length) {
        mandatedQuestions.forEach((mq) => {
          globalIndex = globalIndex + 1;
          if (logicIsEmpty) {
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
          if (logicIsEmpty) {
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
      askQuestions = askQuestions.concat(
        ...questions.filter((q) => q.sectionId === `AQ_${logic.id}`)
      );
      askQuestions.forEach((q) => {
        globalIndex = globalIndex + 1;
        const oppositeOperator = oppositeOperatorMap[logic.operator];
        expression = `${expression};${globalIndex}:(HI) ${q.id} IF ${questionId} EQ EMPTY OR ${questionId} ${oppositeOperator} (V)${logic.operand2}`;
      });

      // Raise Notification;
      const notificationQuestion = logic.raiseNotification;
      if (notificationQuestion) {
        notificationGlobalIndex = notificationGlobalIndex + 1;
        notificationExpression = `${notificationExpression};${notificationGlobalIndex}:${questionId} ${logic.operator} (V)${logic.operand2}`;
      }

      // Ask Evidence;
      evidenceQuestions = questions.filter(
        (q) => q.sectionId === `EVIDENCE_${logic.id}`
      );
      const evidenceQuestion = logic.askEvidence;
      const oppositeOperator = oppositeOperatorMap[logic.operator];
      if (evidenceQuestion && evidenceQuestion.length) {
        let isEvidenceMandatory = false;
        if (questions.findIndex((q) => q.id === evidenceQuestion) > -1) {
          isEvidenceMandatory = questions.filter(
            (q) => q.id === evidenceQuestion
          )[0].required;
        }
        globalIndex = globalIndex + 1;
        if (question.fieldType === 'CB') {
          expression = `${expression};${globalIndex}:(HI) ${evidenceQuestion} IF ${questionId} ${oppositeOperator} (V)${logic.operand2}`;
        } else {
          expression = `${expression};${globalIndex}:(HI) ${evidenceQuestion} IF ${questionId} EQ EMPTY OR ${questionId} ${oppositeOperator} (V)${logic.operand2}`;
        }
        globalIndex = globalIndex + 1;
      }
    });
    if (expression[0] === ';') {
      expression = expression.slice(1, expression.length);
    }
    if (expression[expression.length - 1] === ';') {
      expression = expression.slice(0, expression.length - 1);
    }
    if (notificationExpression[0] === ';') {
      notificationExpression = notificationExpression.slice(
        1,
        notificationExpression.length
      );
    }
    if (notificationExpression[notificationExpression.length - 1] === ';') {
      notificationExpression = notificationExpression.slice(
        0,
        notificationExpression.length - 1
      );
    }
    return {
      expression,
      validationMessage,
      askQuestions,
      evidenceQuestions,
      notificationExpression
    };
  }

  fetchAllFormListNames$(formName) {
    return this.appService._getResp(
      environment.rdfApiUrl,
      `forms/copy/${formName}`
    );
  }

  fetchAllFormsList$() {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', '');
    params.set('limit', '2000000');
    params.set('next', '');
    params.set('fetchType', '');
    params.set('formStatus', 'All');
    params.set('isArchived', 'false');
    return this.appService
      ._getResp(environment.rdfApiUrl, 'forms?' + params.toString(), {
        displayToast: true,
        failureResponse: {}
      })
      .pipe(map((res) => this.formatGetRdfFormsResponse(res)));
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
          isArchivedAt: p?.isArchivedAt ? p?.isArchivedAt : '',
          archivedBy: p.archivedBy ? p.archivedBy : ''
        })) || [];
    return {
      count: resp?.count,
      rows,
      next: resp?.next
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

  fetchAllArchivedForms$ = () => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', '');
    params.set('limit', LIST_LENGTH.toString());
    params.set('next', '');
    params.set('fetchType', 'load');
    params.set('isArchived', 'true');
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

  getFilter(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this.appService._getLocal('', '/assets/json/rdf-filter.json', info);
  }

  getInspectionFilter(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this.appService._getLocal(
      '',
      '/assets/json/forms-inspection-filter.json',
      info
    );
  }
  getArchivedFilter(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this.appService._getLocal(
      '',
      '/assets/json/rdf-archived-filter.json',
      info
    );
  }
  fetchAllInspections$ = () =>
    this.appService
      ._getResp(
        environment.rdfApiUrl,
        'inspections',
        {
          displayToast: true,
          failureResponse: {}
        },
        { limit: graphQLDefaultMaxLimit, next: '' }
      )
      .pipe(map((res) => this.formatInspections(res.items || [])));

  getInspectionsList$(
    queryParams: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<InspectionDetailResponse> {
    const { fetchType, next, limit: gLimit, ...rawParams } = queryParams;
    if (rawParams.assignedToDisplay) {
      rawParams.assignedToDisplay = JSON.stringify(rawParams.assignedToDisplay);
    }

    if (
      ['load', 'search'].includes(fetchType) ||
      (['infiniteScroll'].includes(fetchType) && queryParams.next !== null)
    ) {
      const { displayToast, failureResponse = {} } = info;
      return this.appService
        ._getResp(
          environment.rdfApiUrl,
          'inspections',
          { displayToast, failureResponse },
          { next, limit: gLimit.toString(), ...omitBy(rawParams, isEmpty) }
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
        id: p.inspectionId,
        preTextImage: {
          image: p.formLogo,
          style: {
            width: '40px',
            height: '40px',
            marginRight: '10px'
          },
          condition: true
        },
        dueDateDisplay: p.dueDate
          ? format(new Date(p.dueDate), dateFormat2)
          : '',
        submittedAt: p.submittedAt ? new Date(p.submittedAt) : '',
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
    type: 'due-date' | 'assigned-to' | 'start-date' | 'shift',
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

  fetchTemplates$ = (filter) =>
    this.appService
      ._getResp(
        environment.rdfApiUrl,
        'templates',
        { displayToast: true, failureResponse: {} },
        {
          ...filter,
          limit: 0,
          skip: 0
        }
      )
      .pipe(map((data) => this.formatGetRdfFormsResponse({ items: data })));

  fetchAllTemplateListNames$ = () =>
    this.appService._getResp(environment.rdfApiUrl, 'templates/name');

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

  createTemplate$ = (templateMetadata) =>
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

  archiveDeleteTemplate$ = (templateId: string, templateMetadata: any) =>
    this.appService.patchData(
      environment.rdfApiUrl,
      `templates/${templateId}/archive-delete`,
      {
        data: templateMetadata
      }
    );

  deleteTemplate$ = (templateId: string) =>
    this.appService._removeData(
      environment.rdfApiUrl,
      `templates/${templateId}`
    );

  publishEmbeddedForms$ = (
    form: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._postData(environment.rdfApiUrl, 'abap/forms', form, info);

  getEmbeddedFormId$ = (
    formId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._getResp(
      environment.rdfApiUrl,
      `forms/embedded/${formId}`,
      info
    );

  deactivateAbapForm$ = (
    form: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> => {
    const { name, embeddedFormId } = form;
    const payload = {
      VERSION,
      APPNAME,
      FORMNAME: embeddedFormId,
      FORMTITLE: name,
      DEACTIVATE: 'X'
    };
    return this.appService._updateData(
      environment.rdfApiUrl,
      `abap/forms`,
      payload,
      info
    );
  };

  getAffectedFormList$(queryParams: {
    templateId: string;
    limit: number;
    nextToken: string;
    searchTerm?: string;
    fetchType?: string;
  }) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('templateId', queryParams?.templateId);
    params.set('limit', queryParams?.limit.toString());
    params.set('searchTerm', queryParams?.searchTerm);
    params.set('nextToken', queryParams?.nextToken);
    params.set('fetchType', queryParams?.fetchType);
    return this.appService._getResp(
      environment.rdfApiUrl,
      'template-reference/forms?' + params.toString()
    );
  }

  getFormTemplateUsage$ = (payload: any): Observable<any> =>
    this.appService._getResp(
      environment.rdfApiUrl,
      'template-reference/' + `${payload.templateId}/` + `${payload.formId}`
    );

  updateFormTemplateUsageByFormId$ = (data: any): Observable<any> =>
    this.appService.patchData(
      environment.rdfApiUrl,
      'template-reference/formId',
      data
    );
  copyTemplateReferenceByFormId$ = (data: any): Observable<any> =>
    this.appService._postData(
      environment.rdfApiUrl,
      'template-reference/copy',
      data
    );
  deleteTemplateReferenceByFormId$ = (formId: any): Observable<any> =>
    this.appService._removeData(
      environment.rdfApiUrl,
      'template-reference/formId/' + formId
    );
  downloadSampleFormTemplate = (
    formType: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('formType', formType.toString());

    return this.appService.downloadFile(
      environment.rdfApiUrl,
      'forms/download/sample-template?' + params.toString(),
      info,
      true
    );
  };

  downloadFailure = (
    body: { rows: any },
    formType: string,
    info: ErrorInfo = {} as ErrorInfo
  ) => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('formType', formType.toString());

    return this.appService.downloadFile(
      environment.rdfApiUrl,
      'forms/download/failure?' + params.toString(),
      info,
      false,
      body
    );
  };
  updateAdhocFormOnTemplateChange$ = (
    templateId: string,
    formIds: [string],
    requestId: string
  ): Observable<any> => {
    const formData = new FormData();
    formData.append('templateId', templateId);
    formData.append('formIds', JSON.stringify(formIds));
    return this.getServerSentEvent(
      environment.rdfApiUrl,
      'templates/updateAdhocForms',
      formData,
      requestId
    );
  };
  updateEmbeddedFormOnTemplateChange$ = (
    templateId: string,
    formIds: [string],
    requestId: string
  ): Observable<any> => {
    const formData = new FormData();
    formData.append('templateId', templateId);
    formData.append('formIds', JSON.stringify(formIds));
    return this.getServerSentEvent(
      environment.rdfApiUrl,
      'abap/templates/updateEmbeddedForms',
      formData,
      requestId
    );
  };

  updateConfigOptionsFromColumns(columns: Partial<Column>[]) {
    const allColumns: Column[] = columns.map((column, index) => {
      const defaultColumn: Column = {
        id: '',
        displayName: '',
        type: '',
        controlType: '',
        order: 0,
        showMenuOptions: false,
        subtitleColumn: '',
        searchable: false,
        sortable: false,
        hideable: false,
        visible: false,
        movable: false,
        stickable: false,
        sticky: false,
        groupable: false,
        titleStyle: {},
        subtitleStyle: {},
        hasPreTextImage: false,
        hasPostTextImage: false
      };
      return {
        ...defaultColumn,
        ...column,
        order: index + 1
      };
    });
    return allColumns;
  }
}
