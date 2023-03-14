/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoundPlanObservationsService {
  constructor(private appService: AppService) {}

  getObservations$(queryParams: {
    nextToken?: string;
    limit: any;
    searchKey: string;
    type: string;
  }) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', queryParams?.searchKey);
    params.set('limit', queryParams?.limit);
    params.set('nextToken', queryParams?.nextToken);
    params.set('type', queryParams?.type);
    return this.appService
      ._getResp(
        environment.operatorRoundsApiUrl,
        'round-plan-observations?' + params.toString()
      )
      .pipe(map((res) => this.formateGetObservationResponse(res)));
  }

  getObservationChartCounts$(): any {
    return this.appService._getResp(
      environment.operatorRoundsApiUrl,
      'round-plan-observations/open-count'
    );
  }

  getObservationCount$(type: 'issue' | 'action'): Observable<number> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('type', type);
    return this.appService
      ._getResp(
        environment.operatorRoundsApiUrl,
        'round-plan-observations/count?' + params.toString()
      )
      .pipe(map(({ count }) => count || 0));
  }

  private formateGetObservationResponse(resp) {
    const items = resp?.items?.sort(
      (a, b) =>
        new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
    );
    const rows = items?.map((item: any) => {
      const obj = { ...item };
      obj.dueDate =
        obj['Due Date and Time'] &&
        obj['Due Date and Time'] instanceof Date &&
        !isNaN(obj['Due Date and Time'] as any)
          ? format(new Date(obj['Due Date and Time']), 'do MMM, yyyy')
          : obj['Due Date and Time'];
      return {
        ...obj,
        preTextImage: {
          image: obj?.Photo,
          style: {
            width: '40px',
            height: '40px',
            marginRight: '10px'
          },
          condition: true
        },
        title: obj?.Title || '',
        description: obj?.Description || '',
        locationAsset: obj?.taskDesciption || '',
        locationAssetDescription: obj?.Location
          ? `Location ID: ${obj?.Location || ''}`
          : obj?.Asset
          ? `Asset ID: ${obj?.Asset || ''}`
          : '',
        priority: obj?.Priority || '',
        status: obj?.Status || '',
        assignee: obj['Assign to'] || '',
        createdBy: obj?.createdBy || '',
        notificationNumber: obj?.notificationNumber || '',
        plant: obj?.Plant || ''
      };
    });
    const nextToken = resp?.nextToken;
    return {
      rows,
      nextToken
    };
  }
}
