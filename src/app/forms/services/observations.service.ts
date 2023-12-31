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
import { UsersService } from 'src/app/components/user-management/services/users.service';

const placeHolder = '_ _';
const dataPlaceHolder = '--';
@Injectable({
  providedIn: 'root'
})
export class ObservationsService {
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
  observationChartCounts$ = new BehaviorSubject(null);
  statusColors = {
    open: '#e0e0e0',
    inprogress: '#ffcc01',
    overdue: '#aa2e24',
    resolved: '#2C9E53'
  };
  priorityColors = {
    high: '#F6695E',
    medium: '#f4a916',
    low: '#c8dae1',
    shutdown: '#000000',
    turnaround: '#3C59FE',
    emergency: '#E2190E'
  };
  colors: [
    {
      key: 'open';
      color: '#B96060';
    },
    {
      key: 'inprogress';
      color: '#FF9500';
    },
    {
      key: 'resolved';
      color: '#357A38';
    },
    {
      key: 'high';
      color: '#FF3B30';
    },
    {
      key: 'medium';
      color: '#FF9500';
    },
    {
      key: 'low';
      color: '#8A8A8C';
    }
  ];
  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService
  ) {}

  getObservations$(queryParams: {
    next?: string;
    limit: any;
    searchKey: string;
    type: string;
    moduleName: string;
  }) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', queryParams?.searchKey);
    params.set('limit', queryParams?.limit);
    params.set('next', queryParams?.next);
    params.set('type', queryParams?.type);
    return this.appService
      ._getResp(
        environment.operatorRoundsApiUrl,
        `${queryParams.moduleName}?` + params.toString()
      )
      .pipe(
        map((res) => this.formateGetObservationResponse(res, queryParams.type))
      );
  }

  getObservationChartCounts$(param) {
    return this.appService
      ._getResp(environment.operatorRoundsApiUrl, `${param}/chart-data`)
      .pipe(map((result) => this.observationChartCounts$.next(result)));
  }

  updateIssueOrAction$ = (
    issueOrActionId: string,
    issueOrAction: IssueOrAction,
    urlString: string,
    moduleName: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<IssueOrAction> =>
    this.appService
      .patchData(
        environment.operatorRoundsApiUrl,
        `${moduleName}/${urlString}/${issueOrActionId}`,
        issueOrAction,
        info
      )
      .pipe(map((response) => (response === null ? issueOrAction : response)));

  createIssueOrActionLogHistory$ = (
    issueOrActionId: string,
    history: History,
    urlString: string,
    moduleName: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<IssueOrAction> =>
    this.appService._postData(
      environment.operatorRoundsApiUrl,
      `${moduleName}/${urlString}/${issueOrActionId}/log-history`,
      history,
      info
    );

  uploadIssueOrActionLogHistoryAttachment$ = (
    issueOrActionId: string,
    form,
    urlString: string,
    moduleName,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<IssueOrAction> =>
    this.appService._postData(
      environment.operatorRoundsApiUrl,
      `${moduleName}/${urlString}/${issueOrActionId}/upload-attacment`,
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
    moduleName: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<HistoryResponse> {
    return this.appService
      ._getResp(
        environment.operatorRoundsApiUrl,
        `${moduleName}/${type}/${issueOrActionId}/log-history`,
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
    moduleName: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this.appService._postData(
      environment.operatorRoundsApiUrl,
      `${moduleName}/issue/notification`,
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
        updatedAt
        _version
        _lastChangedAt
        _deleted
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
        updatedAt
        _version
        _lastChangedAt
        _deleted
      }
    }`;
    return API.graphql(
      graphqlOperation(statement, {
        input
      })
    ) as unknown as Observable<any>;
  }

  onUpdateActionsList$(input) {
    const statement = `subscription OnUpdateActionsList($filter: ModelSubscriptionActionsListFilterInput) {
      onUpdateActionsList(filter: $filter) {
        id
        actionId
        actionData
        taskId
        taskDescription
        searchTerm
        createdBy
        roundId
        assignedTo
        isDeleted
        moduleName
        plantId
        createdAt
        updatedAt
        _version
        _lastChangedAt
        _deleted
      }
    }`;
    return API.graphql(
      graphqlOperation(statement, {
        input
      })
    ) as unknown as Observable<any>;
  }

  onUpdateIssuesList$(input) {
    const statement = `subscription OnUpdateIssuesList($filter: ModelSubscriptionIssuesListFilterInput) {
      onUpdateIssuesList(filter: $filter) {
        id
        issueId
        issueData
        taskId
        taskDescription
        notificationInfo
        searchTerm
        createdBy
        roundId
        assignedTo
        isDeleted
        moduleName
        plantId
        createdAt
        updatedAt
        _version
        _lastChangedAt
        _deleted
      }
    }`;
    return API.graphql(
      graphqlOperation(statement, {
        input
      })
    ) as unknown as Observable<any>;
  }

  onCreateIssuesAttachments$(input) {
    const statement = `subscription onCreateIssuesAttachments($filter: ModelSubscriptionIssuesAttachmentsFilterInput) {
      onCreateIssuesAttachments(filter: $filter) {
        _deleted
        _lastChangedAt
        _version
        assignedTo
        createdAt
        id
        imageData
        objectId
        plantId
        updatedAt
      }
    }`;
    return API.graphql(
      graphqlOperation(statement, {
        input
      })
    ) as unknown as Observable<any>;
  }

  onCreateActionsAttachments$(input) {
    const statement = `subscription onCreateActionsAttachments($filter: ModelSubscriptionActionsAttachmentsFilterInput) {
      onCreateActionsAttachments(filter: $filter) {
        _deleted
        _lastChangedAt
        _version
        createdAt
        assignedTo
        id
        imageData
        objectId
        plantId
        updatedAt
      }
    }`;
    return API.graphql(
      graphqlOperation(statement, {
        input
      })
    ) as unknown as Observable<any>;
  }

  formatUsersDisplay(users: string): string {
    const assignee: string[] = users?.split(',')?.filter(Boolean) || [];
    if (assignee?.length > 0) {
      const formattedDisplayNames: string[] = [];
      assignee.forEach((a) => {
        const foundAssignee = this.userService.getUserFullName(a);
        if (foundAssignee) {
          formattedDisplayNames.push(foundAssignee);
        }
      });
      if (formattedDisplayNames?.length > 0) {
        if (formattedDisplayNames?.length > 1) {
          return `${formattedDisplayNames[0]} + ${assignee?.length - 1} more`;
        }
        return formattedDisplayNames[0];
      }
    } else {
      return '';
    }
  }

  formatUserFullNameDisplay(emailList): string {
    let emailToDisplay = null;
    if (emailList && emailList?.includes(',')) {
      const list = emailList?.split(',')?.filter(Boolean);
      emailToDisplay = [];
      if (list?.length > 0) {
        list.forEach((email) => {
          if (email) {
            const foundName = this.userService.getUserFullName(email);
            if (foundName) {
              emailToDisplay.push(foundName);
            }
          }
        });
      }
      emailToDisplay = emailToDisplay.toString();
    } else {
      emailToDisplay = this.userService.getUserFullName(emailList);
    }
    return emailToDisplay;
  }

  removeSpecialCharacter = (str = '') => str?.replace(/[^A-Z0-9]/gi, '');

  prepareStatus(status = '') {
    let formattedStatus = status ?? '';
    if (this.removeSpecialCharacter(status)?.toLowerCase() === 'inprogress') {
      formattedStatus = 'In Progress';
    }
    return formattedStatus;
  }

  prepareColorsAndData(result, action: 'priority' | 'status') {
    const color = [];
    const data = [];
    Object.entries(result).map(([key, value]) => {
      const leanKey = this.removeSpecialCharacter(key.toLowerCase());
      color.push(
        action === 'priority'
          ? this.priorityColors[leanKey]
          : this.statusColors[leanKey]
      );
      data.push({
        name: leanKey === 'inprogress' ? 'In Progress' : key,
        value
      });
    });
    return {
      color,
      data
    };
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
        dueDate:
          item?.DUEDATE && this.isValidDate(new Date(item?.DUEDATE))
            ? format(new Date(item?.DUEDATE), 'dd MMM yyyy hh:mm a')
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
        status: item?.STATUS ?? '',
        statusDisplay: this.prepareStatus(item?.STATUS),
        plant: item.WERKS?.replace(dataPlaceHolder, placeHolder) || placeHolder,
        category:
          item.CATEGORY?.replace(dataPlaceHolder, placeHolder) || placeHolder,
        task: item.TASK || placeHolder,
        round: item.ROUND || placeHolder,
        raisedBy: item.createdBy,
        notificationInfo: item.notificationInfo || placeHolder,
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

  private isValidDate(date): boolean {
    return date instanceof Date && !isNaN(date as unknown as number);
  }
}
