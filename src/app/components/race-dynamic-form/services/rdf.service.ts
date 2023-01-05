/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { API, graphqlOperation } from 'aws-amplify';
import { format, formatDistance } from 'date-fns';
import { from, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  APIService,
  GetFormListQuery,
  ListFormListsQuery,
  ListFormSubmissionListsQuery
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
    if (this.nextToken === null) {
      return;
    }
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

  getSubmissionFormsList$(queryParams: {
    skip?: number;
    limit: number;
    searchKey: string;
  }) {
    if (this.nextToken === null) {
      return;
    }
    return from(
      this.awsApiService.ListFormSubmissionLists(
        {
          name: {
            contains: queryParams?.searchKey || ''
          }
        },
        queryParams.limit,
        this.nextToken
      )
    ).pipe(map((res) => this.formatSubmittedListResponse(res)));
  }

  getFormsListCount$(): Observable<number> {
    const statement = `query { listFormLists { items { id } } }`;
    return from(API.graphql(graphqlOperation(statement))).pipe(
      map(
        ({ data: { listFormLists } }: any) => listFormLists?.items?.length || 0
      )
    );
  }

  getSubmissionFormsListCount$(): Observable<number> {
    const statement = `query { listFormSubmissionLists { items { id } } }`;
    return from(API.graphql(graphqlOperation(statement))).pipe(
      map(
        ({ data: { listFormSubmissionLists } }: any) =>
          listFormSubmissionLists?.items?.length || 0
      )
    );
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
    this.nextToken = resp?.nextToken;
    return {
      count,
      rows
    };
  }

  private formatSubmittedListResponse(resp: ListFormSubmissionListsQuery) {
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
          responses: '23/26',
          createdAt: format(new Date(p?.createdAt), 'Do MMM'),
          updatedAt: formatDistance(new Date(p?.updatedAt), new Date(), {
            addSuffix: true
          })
        })) || [];
    this.nextToken = resp?.nextToken;
    return {
      rows
    };
  }
}
