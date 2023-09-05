/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
      environment.integrationsApiUrl,
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
      environment.integrationsApiUrl,
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
      environment.integrationsApiUrl,
      `connections/${connectorId}`,
      connectionObj,
      info
    );

  deleteConnection$ = (
    connectorId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._removeData(
      environment.integrationsApiUrl,
      `connections/${connectorId}`,
      info
    );

  getIntegrations$ = (
    connectorId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._getResp(
      environment.integrationsApiUrl,
      `connections/${connectorId}`,
      info
    );

  createIntegration$ = (
    connectorId: string,
    integrationObj: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._postData(
      environment.integrationsApiUrl,
      `connections/${connectorId}/integrations`,
      integrationObj,
      info
    );

  updateIntegration$ = (
    connectorId: string,
    integrationId: string,
    integrationObj: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService.patchData(
      environment.integrationsApiUrl,
      `connections/${connectorId}/integrations/${integrationId}`,
      integrationObj,
      info
    );

  deleteIntegration$ = (
    connectorId: string,
    integrationId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._removeData(
      environment.integrationsApiUrl,
      `connections/${connectorId}/integrations/${integrationId}`,
      info
    );
}
