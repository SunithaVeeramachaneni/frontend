/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import {
  APIService,
  ListUnitListsQuery,
  ModelUnitListFilterInput,
  UpdateUnitMeasumentInput,
  UpdateUnitMeasumentMutation
} from 'src/app/API.service';
import { map } from 'rxjs/operators';
import { API, graphqlOperation } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class UnitMeasurementService {
  constructor(private readonly awsApiService: APIService) {}

  getUnitOfMeasurementList$(queryParams: {
    nextToken?: string;
    limit: number;
    searchKey: string;
    fetchType: string;
  }) {
    if (
      ['load', 'search'].includes(queryParams.fetchType) ||
      (['infiniteScroll'].includes(queryParams.fetchType) &&
        queryParams.nextToken !== null)
    ) {
      const isSearch = queryParams.fetchType === 'search';
      return from(
        // eslint-disable-next-line no-underscore-dangle
        this._ListUnitLists(
          {
            ...(queryParams.searchKey && {
              searchTerm: { contains: queryParams?.searchKey.toLowerCase() }
            }),
            isDeleted: {
              eq: false
            }
          },
          !isSearch && queryParams.limit,
          !isSearch && queryParams.nextToken
        )
      ).pipe(map((res) => this.formatGraphQAssetsResponse(res)));
    } else {
      return of({
        count: 0,
        rows: [],
        nextToken: null
      });
    }
  }

  updateUnitMeasurement$(
    input: UpdateUnitMeasumentInput
  ): Observable<UpdateUnitMeasumentMutation> {
    return from(this.awsApiService.UpdateUnitMeasument(input));
  }

  private formatGraphQAssetsResponse(resp: ListUnitListsQuery) {
    const rows = resp?.items?.map((item: any) => ({
      ...item,
      noOfUnits: item?.unitMeasuments?.items?.length ?? 0
    }));

    const units = [];
    resp?.items.forEach((row: any) => {
      if (row?.unitMeasuments?.items.length > 0) {
        row?.unitMeasuments?.items.forEach((item) => {
          units.push({
            noOfUnits: row?.unitMeasuments?.items?.length ?? 0,
            unitId: row.id,
            name: row.name,
            searchTerm: row.searchTerm,
            ...item,
            description: item?.isDefault
              ? `${item.description} (Default)`
              : item.description
          });
        });
      }
    });
    console.log(
      '🚀 ~ file: unit-measurement.service.ts:45 ~ UnitMeasurementService ~ formatGraphQAssetsResponse ~ resp',
      units
    );

    const count = rows?.length || 0;
    const nextToken = resp?.nextToken;
    return {
      count,
      rows: units,
      nextToken
    };
  }

  private async _ListUnitLists(
    filter?: ModelUnitListFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListUnitListsQuery> {
    const statement = `query ListUnitLists($filter: ModelUnitListFilterInput, $limit: Int, $nextToken: String) {
        listUnitLists(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            name
            searchTerm
            isDeleted
            createdAt
            updatedAt
            _version
            unitMeasuments(filter: {isDeleted: {eq: false}}) {
              items {
                description
                createdAt
                id
                isDefault
                isDeleted
                symbol
                unitlistID
              }
            }
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return response?.data?.listUnitLists as ListUnitListsQuery;
  }
}
