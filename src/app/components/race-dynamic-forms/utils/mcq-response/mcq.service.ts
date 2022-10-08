import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { ErrorInfo } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';

const VALIDFROM = '20221002135512';
const VALIDTO = '99991230183000';
const VERSION = '001';
const APPNAME = 'MWORKORDER';
@Injectable({
  providedIn: 'root'
})
export class McqService {
  constructor(private appService: AppService) {}

  createResponse$ = (
    resp: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._postData(
      environment.rdfApiUrl,
      'forms/responses',
      resp,
      info
    );

  updateResponse$ = (
    id: string,
    data: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService.patchData(
      environment.rdfApiUrl,
      `forms/responses/${id}`,
      data,
      info
    );
}
