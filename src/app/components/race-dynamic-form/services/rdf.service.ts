/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { formatDistance } from 'date-fns';
import { map } from 'rxjs/operators';

import { ErrorInfo, RaceDynamicForm } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RaceDynamicFormService {
  constructor(private readonly appService: AppService) {}

  getForms$ = (
    queryParams: {
      skip: number;
      limit: number;
      searchKey: string;
    },
    info: ErrorInfo = {} as ErrorInfo
  ) =>
    this.appService
      ._getResp(environment.formsApiUrl, 'forms', info, queryParams)
      .pipe(map((resp) => this.formatForms(resp)));

  private formatForms(resp: {
    formsCount: number;
    paginatedForms: RaceDynamicForm[];
  }) {
    const rows =
      resp?.paginatedForms?.map((p) => ({
        ...p,
        preTextImage: {
          style: {
            width: '30px',
            height: '30px',
            'border-radius': '50%',
            display: 'block',
            padding: '0px 10px'
          },
          image: p?.formLogo,
          condition: true
        },
        updatedBy: p.updatedBy,
        createdBy: p.createdBy,
        updatedAt: formatDistance(new Date(p?.updatedAt), new Date(), {
          addSuffix: true
        })
      })) || [];
    const count = resp?.formsCount || 0;
    return {
      count,
      rows
    };
  }
}
