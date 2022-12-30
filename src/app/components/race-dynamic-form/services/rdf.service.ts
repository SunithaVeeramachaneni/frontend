import { LoadEvent, SearchEvent } from './../../../interfaces/events';
import { TableEvent } from './../../../interfaces/table-configuration';
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { formatDistance } from 'date-fns';
import { from, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { rdfMockData } from './rdf.mock';
import { ErrorInfo, RaceDynamicForm } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from '../../../../environments/environment';
import {
  APIService,
  GetFormListQuery,
  ListFormListsQuery
} from 'src/app/API.service';

@Injectable({
  providedIn: 'root'
})
export class RaceDynamicFormService {
  nextToken = '';
  fetchForms$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  constructor(
    private readonly appService: AppService,
    private readonly awsApiService: APIService
  ) {}

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

  getFormsMock$ = (queryParams: {
    skip: number;
    limit: number;
    searchKey: string;
  }) => {
    if (queryParams?.searchKey) {
      const rows = rdfMockData.paginatedForms.filter(
        (mock) =>
          mock.name
            .toLowerCase()
            ?.indexOf(queryParams.searchKey.toLowerCase()) > -1
      );
      return of({ paginatedForms: rows, formsCount: rows.length }).pipe(
        map((res: any) => this.formatForms(res))
      );
    } else {
      return of(rdfMockData).pipe(map((res: any) => this.formatForms(res)));
    }
  };

  getFormsList$(queryParams: {
    skip?: number;
    limit: number;
    searchKey: string;
  }) {
    return from(
      this.awsApiService.ListFormLists(
        {
          Title: {
            contains: queryParams?.searchKey || ''
          }
        },
        queryParams.limit,
        this.nextToken
      )
    ).pipe(map((res) => this.formatGraphQLFormsResponse(res)));
  }

  createFormList$(
    formListQuery: Pick<
      GetFormListQuery,
      'Title' | 'Description' | 'Owner' | 'updatedBy' | 'Image'
    >
  ) {
    return from(
      this.awsApiService.CreateFormList({
        Image: formListQuery.Image ?? '',
        Title: formListQuery?.Title ?? '',
        Description: formListQuery.Description ?? '',
        Status: 'draft',
        Owner: formListQuery.Owner ?? '',
        PublishedDate: new Date().toISOString(),
        updatedBy: formListQuery.updatedBy ?? ''
      })
    );
  }

  deleteForm$(id: string) {
    return from(this.awsApiService.DeleteFormList({ id }, {}));
  }

  private formatGraphQLFormsResponse(resp: ListFormListsQuery) {
    const rows =
      resp.items
        .sort(
          (a, b) =>
            new Date(b?.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        ?.map((p) => ({
          ...p,
          preTextImage: {
            style: {
              width: '30px',
              height: '30px',
              'border-radius': '50%',
              display: 'block',
              padding: '0px 10px'
            },
            image: p?.Image,
            condition: true
          },
          updatedBy: p.updatedBy,
          createdBy: p.Owner,
          updatedAt: formatDistance(new Date(p?.updatedAt), new Date(), {
            addSuffix: true
          })
        })) || [];
    const count = resp?.items.length || 0;
    this.nextToken = resp?.nextToken || '';
    return {
      count,
      rows
    };
  }

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
