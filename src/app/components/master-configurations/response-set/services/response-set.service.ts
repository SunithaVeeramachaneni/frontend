/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { formatDistance } from 'date-fns';

import { environment } from 'src/environments/environment';

import { AppService } from 'src/app/shared/services/app.services';

import {
  LoadEvent,
  SearchEvent,
  TableEvent,
  CreateResponseSet,
  UpdateResponseSet,
  ErrorInfo
} from '../../../../interfaces';
import { DateUtilService } from 'src/app/shared/utils/dateUtils';
import { metadataFlatModuleNames } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ResponseSetService {
  fetchResponses$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  addOrEditResponseSet$: BehaviorSubject<any> = new BehaviorSubject<any>({
    data: {} as UpdateResponseSet,
    actionType: '' as string
  });
  usersInfoByEmail = {};
  constructor(
    private _appService: AppService,
    private readonly dateUtilService: DateUtilService
  ) {}

  uploadExcel(
    form: FormData,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService._postData(
      environment.masterConfigApiUrl,
      'response-set/upload',
      form,
      info
    );
  }

  fetchAllGlobalResponses$ = (isActive = true) => {
    const info: ErrorInfo = {} as ErrorInfo;
    const { displayToast, failureResponse = {} } = info;
    return this._appService
      ._getResp(
        environment.masterConfigApiUrl,
        'response-set/list',
        { displayToast, failureResponse },
        { isActive }
      )
      .pipe(shareReplay(1));
  };

  fetchResponseSetList$ = (queryParams: {
    next?: string;
    limit: number;
    searchTerm?: string;
    isActive?: boolean;
  }) => {
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: {}
    };
    if (queryParams.next !== null) {
      return this._appService
        ._getResp(
          environment.masterConfigApiUrl,
          'response-set/list',
          info,
          queryParams
        )
        .pipe(map((res) => this.formatGraphQLocationResponse(res)));
    } else {
      return of({
        count: null,
        rows: [],
        next: null
      });
    }
  };

  createResponseSet$ = (responseSet: CreateResponseSet) => {
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    return this._appService._postData(
      environment.masterConfigApiUrl,
      'response-set/create',
      {
        name: responseSet.name,
        description: responseSet?.description,
        refCount: responseSet.refCount,
        isMultiColumn: responseSet.isMultiColumn,
        values: responseSet.values,
        moduleName: responseSet.moduleName
      },
      info
    );
  };

  updateResponseSet$ = (responseSet: UpdateResponseSet) => {
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    const updatePayload = {
      name: responseSet.name,
      description: responseSet.description,
      refCount: responseSet.refCount,
      moduleName: responseSet.moduleName,
      isMultiColumn: responseSet.isMultiColumn,
      values: responseSet.values,
      createdBy: responseSet.createdBy
    };
    return this._appService
      .patchData(
        environment.masterConfigApiUrl,
        `response-set/update/${responseSet.id}`,
        updatePayload,
        info
      )
      .pipe(
        map((response) =>
          response === null ? { id: responseSet.id, ...updatePayload } : {}
        )
      );
  };

  deleteResponseSet$ = (id: string) => {
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    return this._appService._removeData(
      environment.masterConfigApiUrl,
      `response-set/delete/${id}`,
      info
    );
  };

  downloadSampleResponseSetTemplate(
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService.downloadFile(
      environment.masterConfigApiUrl,
      'response-set/download/sample-template',
      info,
      true,
      {}
    );
  }

  downloadFailure(
    body: { rows: any },
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService.downloadFile(
      environment.masterConfigApiUrl,
      'response-set/download/failure',
      info,
      false,
      body
    );
  }

  fetchResponseSetByModuleName$ = () => {
    const info: ErrorInfo = {} as ErrorInfo;
    const {
      displayToast,
      failureResponse = {
        [metadataFlatModuleNames.RACE_DYNAMIC_FORMS]: [],
        [metadataFlatModuleNames.RDF_TEMPLATES]: []
      }
    } = info;
    return this._appService._getResp(
      environment.masterConfigApiUrl,
      'response-set/list/all-modules',
      { displayToast, failureResponse }
    );
  };

  private formatGraphQLocationResponse(resp) {
    const rows =
      resp.items?.map((p) => ({
        ...p,
        preTextImage: {
          image: p?.image,
          style: {
            width: '40px',
            height: '40px',
            marginRight: '10px'
          },
          condition: true
        },
        archivedAt: p.createdAt
          ? formatDistance(new Date(p.createdAt), new Date(), {
              addSuffix: true
            })
          : '',
        updatedAt:
          p?.updatedAt &&
          this.dateUtilService.isValidDate(new Date(p?.updatedAt))
            ? p?.updatedAt
            : ''
      })) || [];
    const count = resp?.count || 0;
    const next = resp?.next;
    return {
      count,
      rows,
      next
    };
  }
}
