/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorInfo } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from '../../../../environments/environment';

export interface UpdateGridOptions {
  update: boolean;
  subtractWidth: number;
}

@Injectable({
  providedIn: 'root'
})
export class IntegrationsService {
  constructor(private appService: AppService) {}

  getConnectors$ = (info: ErrorInfo = {} as ErrorInfo): Observable<any> =>
    this.appService._getResp(
      // environment.integrationsApiUrl,
      'http://localhost:8012/',
      'connections',
      info
    );

  testConnection$ = (
    connectionObj: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._postData(
      environment.integrationsApiUrl,
      'verify',
      connectionObj,
      info
    );
  createConnection$ = (
    connectionObj: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._postData(
      // environment.integrationsApiUrl,
      'http://localhost:8012/',
      'connections',
      connectionObj,
      info
    );
  updateConnection$ = (
    connectorId: string,
    connectionObj: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService.patchData(
      // environment.integrationsApiUrl,
      'http://localhost:8012/',
      `connections/${connectorId}`,
      connectionObj,
      info
    );

  deleteConnection$ = (
    connectorId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._removeData(
      // environment.integrationsApiUrl,
      'http://localhost:8012/',
      `connections/${connectorId}`,
      info
    );

  getIntegrations$ = (
    connectorId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._getResp(
      // environment.integrationsApiUrl,
      'http://localhost:8012/',
      `connections/${connectorId}`,
      info
    );
}
