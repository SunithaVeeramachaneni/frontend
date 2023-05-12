/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ErrorInfo,
  History,
  HistoryResponse,
  IssueOrAction,
  LoadEvent,
  SearchEvent,
  TableEvent
} from 'src/app/interfaces';
import { API, graphqlOperation } from 'aws-amplify';

import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import { UsersService } from '../../user-management/services/users.service';

const placeHolder = '_ _';
const dataPlaceHolder = '--';

@Injectable({
  providedIn: 'root'
})
export class RoundPlanObservationsService {
  fetchIssues$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  issuesNextToken = '';
  issues$: Subject<{ count: number; next: string; rows: any[] }> =
    new Subject();
  fetchActions$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  actionsNextToken = '';
  actions$: Subject<{ count: number; next: string; rows: any[] }> =
    new Subject();
  constructor(
    private readonly appService: AppService,
    private userService: UsersService
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

  createNotification(
    issue,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this.appService._postData(
      environment.operatorRoundsApiUrl,
      `issue/notification`,
      issue,
      info
    );
  }

  onCreateIssuesLogHistory$(input) {
    const statement = `subscription OnCreateIssuesLogHistory($filter: ModelSubscriptionIssuesLogHistoryFilterInput) {
      onCreateIssuesLogHistory(filter: $filter) {
        id
        message
        type
        username
        issueslistID
        createdBy
        assignedTo
        isDeleted
        moduleName
        plantId
        createdAt
        createdBy
      }
    }`;
    return API.graphql(
      graphqlOperation(statement, {
        input
      })
    ) as unknown as Observable<any>;
  }

  onCreateActionsLogHistory$(input) {
    const statement = `subscription OnCreateActionsLogHistory($filter: ModelSubscriptionActionsLogHistoryFilterInput) {
      onCreateActionsLogHistory(filter: $filter) {
        id
        message
        type
        username
        actionslistID
        createdBy
        assignedTo
        isDeleted
        moduleName
        plantId
        createdAt
        createdBy
      }
    }`;
    return API.graphql(
      graphqlOperation(statement, {
        input
      })
    ) as unknown as Observable<any>;
  }

  formatUsersDisplay(users: string) {
    const assignee = users.split(',');
    const formatedDisplay = assignee[0]
      ? this.userService.getUserFullName(assignee[0])
      : '';
    return assignee.length === 1
      ? formatedDisplay
      : `${formatedDisplay} + ${assignee.length - 1} more`;
  }

  removeSpecialCharacter = (str = '') => str?.replace(/[^A-Z0-9]/gi, '');

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
          image:
            type === 'issue'
              ? '/assets/maintenance-icons/issue-icon.svg'
              : '/assets/maintenance-icons/actionsIcon.svg',
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
        status: this.prepareStatus(item?.STATUS),
        plant: item.WERKS?.replace(dataPlaceHolder, placeHolder) || placeHolder,
        category:
          item.CATEGORY?.replace(dataPlaceHolder, placeHolder) || placeHolder,
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

  private prepareStatus(status = '') {
    let formattedStatus = status ?? '';
    if (status?.toLowerCase() === 'in-progress') {
      formattedStatus = 'In Progress';
    }
    return formattedStatus;
  }
}
