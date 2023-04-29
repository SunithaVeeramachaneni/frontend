/* eslint-disable no-underscore-dangle */
import { Injectable, NgZone } from '@angular/core';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ErrorInfo,
  History,
  HistoryResponse,
  IssueOrAction
} from 'src/app/interfaces';

import { AppService } from 'src/app/shared/services/app.services';
import { SseService } from 'src/app/shared/services/sse.service';
import { environment } from 'src/environments/environment';

const placeHolder = '_ _';
const dataPlaceHolder = '--';

@Injectable({
  providedIn: 'root'
})
export class RoundPlanObservationsService {
  constructor(
    private readonly appService: AppService,
    private sseService: SseService,
    private zone: NgZone
  ) {}

  getObservations$(queryParams: {
    next?: string;
    limit: any;
    searchKey: string;
    type: string;
  }) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', queryParams?.searchKey);
    params.set('limit', queryParams?.limit);
    params.set('next', queryParams?.next);
    params.set('type', queryParams?.type);
    return this.appService
      ._getResp(
        environment.operatorRoundsApiUrl,
        'round-observations?' + params.toString()
      )
      .pipe(
        map((res) => this.formateGetObservationResponse(res, queryParams.type))
      );
  }

  getObservationChartCounts$(): any {
    return this.appService._getResp(
      environment.operatorRoundsApiUrl,
      'round-observations/chart-data'
    );
  }

  updateIssueOrAction$ = (
    issueOrActionId: string,
    issueOrAction: IssueOrAction,
    urlString: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<IssueOrAction> =>
    this.appService
      .patchData(
        environment.operatorRoundsApiUrl,
        `${urlString}/${issueOrActionId}`,
        issueOrAction,
        info
      )
      .pipe(map((response) => (response === null ? issueOrAction : response)));

  createIssueOrActionLogHistory$ = (
    issueOrActionId: string,
    history: History,
    urlString: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<IssueOrAction> =>
    this.appService._postData(
      environment.operatorRoundsApiUrl,
      `${urlString}/${issueOrActionId}/log-history`,
      history,
      info
    );

  uploadIssueOrActionLogHistoryAttachment$ = (
    issueOrActionId: string,
    form: FormData,
    urlString: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<IssueOrAction> =>
    this.appService._postData(
      environment.operatorRoundsApiUrl,
      `${urlString}/${issueOrActionId}/upload-attacment`,
      form,
      info
    );

  getIssueOrActionLogHistory$(
    issueOrActionId: string,
    type: string,
    queryParams: {
      limit?: number;
      next?: string;
    },
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<HistoryResponse> {
    return this.appService
      ._getResp(
        environment.operatorRoundsApiUrl,
        `${type}/${issueOrActionId}/log-history`,
        info,
        queryParams
      )
      .pipe(
        map((history: HistoryResponse) => ({
          ...history,
          rows: history.rows.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        })),
        map((history: HistoryResponse) => ({
          ...history,
          rows: history.rows.map((log) => ({
            ...log,
            createdAt: format(new Date(log.createdAt), 'dd MMM yyyy, hh:mm a'),
            message:
              log.type === 'Object' ? JSON.parse(log.message) : log.message
          }))
        }))
      );
  }

  onCreateIssueOrActionLogHistoryEventSource(
    urlString: string
  ): Observable<History> {
    return new Observable((observer) => {
      const eventSource = this.sseService.getEventSourceWithGet(
        `${environment.operatorRoundsApiUrl}${urlString}`,
        null
      );
      eventSource.stream();
      eventSource.onmessage = (event) => {
        this.zone.run(() => {
          observer.next(JSON.parse(event.data));
        });
      };
      eventSource.onerror = (event) => {
        this.zone.run(() => {
          if (event.data) {
            observer.error(JSON.parse(event.data));
          }
        });
      };
    });
  }

  closeOnCreateIssueOrActionLogHistoryEventSourceEventSource(): void {
    this.sseService.closeEventSource();
  }

  private formateGetObservationResponse(resp, type) {
    const items = resp?.items?.sort(
      (a, b) =>
        new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
    );
    const rows = items.map((item) => {
      const location =
        item.SWERK?.replace(dataPlaceHolder, placeHolder) || placeHolder;
      const asset =
        item.ANLNR?.replace(dataPlaceHolder, placeHolder) || placeHolder;
      return {
        ...item,
        preTextImage: {
          image: '/assets/maintenance-icons/issue-icon.svg',
          style: {
            width: '40px',
            height: '40px',
            marginRight: '10px'
          },
          condition: true
        },
        dueDate: item?.DUEDATE
          ? format(new Date(item?.DUEDATE), 'dd MMM, yyyy')
          : '',
        title: item.TITLE,
        description: item.DESCRIPTION,
        location,
        asset,
        locationAsset: location !== placeHolder ? location : asset,
        locationAssetDescription:
          location !== placeHolder
            ? `Location ID: ${item.SWERK}`
            : asset !== placeHolder
            ? `Asset ID: ${item.ANLNR}`
            : '',
        priority: item.PRIORITY,
        status: item.STATUS,
        plant: item.WERKS?.replace(dataPlaceHolder, placeHolder) || placeHolder,
        category: item.CATEGORY || placeHolder,
        task: item.TASK || placeHolder,
        round: item.ROUND || placeHolder,
        raisedBy: item.createdBy,
        notificationNumber: item.notificationNumber || placeHolder,
        issueOrActionDBVersion: item._version,
        type
      };
    });
    return {
      rows,
      next: resp?.next,
      count: resp?.count
    };
  }
}
