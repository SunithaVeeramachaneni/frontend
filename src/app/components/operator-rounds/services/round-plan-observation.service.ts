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
    const rows =
      resp?.items
        .sort(
          (a, b) =>
            new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
        )
        ?.map((item: any) => ({
          ...item,
          preTextImage: {
            image: item?.Photo,
            style: {
              width: '40px',
              height: '40px',
              marginRight: '10px'
            },
            condition: true
          },
          title: item?.Title || '',
          description: item?.Description || '',
          locationAsset: item?.Location || item?.Asset || '',
          locationAssetDescription: item?.Location
            ? `Location ID: ${item?.taskId || ''}`
            : item?.Asset
            ? `Asset ID: ${item?.taskId || ''}`
            : '',
          priority: item?.Priority || '',
          status: item?.Status || '',
          dueDate: item['Due Date and Time']
            ? format(new Date(item['Due Date and Time']), 'do MMM, yyyy')
            : '',
          assignee: item['Assign to'] || '',
          createdBy: item?.createdBy || '',
          notificationNumber: item?.notificationNumber || '',
          plant: item?.Plant || ''
        })) || [];
    const nextToken = resp?.nextToken;
    return {
      rows,
      nextToken
    };
  }
}
