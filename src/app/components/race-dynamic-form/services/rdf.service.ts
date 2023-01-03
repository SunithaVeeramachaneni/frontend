/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { formatDistance } from 'date-fns';
import { from, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  APIService,
  GetFormListQuery,
  ListFormListsQuery
} from 'src/app/API.service';
import { LoadEvent, SearchEvent, TableEvent } from './../../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class RaceDynamicFormService {
  nextToken = '';
  fetchForms$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  constructor(private readonly awsApiService: APIService) {}

  getFormsList$(queryParams: {
    skip?: number;
    limit: number;
    searchKey: string;
  }) {
    return from(
      this.awsApiService.ListFormLists(
        {
          name: {
            contains: queryParams?.searchKey || ''
          }
        },
        queryParams.limit,
        this.nextToken
      )
    ).pipe(map((res) => this.formatGraphQLFormsResponse(res)));
  }

  createForm$(
    formListQuery: Pick<
      GetFormListQuery,
      | 'name'
      | 'formLogo'
      | 'description'
      | 'author'
      | 'lastPublishedBy'
      | 'publishedDate'
      | 'tags'
      | 'formType'
    >
  ) {
    return from(
      this.awsApiService.CreateFormList({
        formLogo: formListQuery.formLogo ?? '',
        name: formListQuery?.name ?? '',
        description: formListQuery.description ?? '',
        formStatus: 'draft',
        author: formListQuery.author ?? '',
        publishedDate: new Date().toISOString(),
        lastPublishedBy: formListQuery.lastPublishedBy ?? '',
        formType: formListQuery.formType ?? '',
        tags: formListQuery.tags || null,
        isPublic: true
      })
    );
  }

  deleteForm$(id: string) {
    return from(this.awsApiService.DeleteFormList({ id }, {}));
  }

  private formatGraphQLFormsResponse(resp: ListFormListsQuery) {
    console.log(
      '🚀 ~ file: rdf.service.ts:66 ~ RaceDynamicFormService ~ formatGraphQLFormsResponse ~ resp',
      resp
    );
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
            image: p?.formLogo,
            condition: true
          },
          updatedBy: p.lastPublishedBy,
          createdBy: p.author,
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
}
