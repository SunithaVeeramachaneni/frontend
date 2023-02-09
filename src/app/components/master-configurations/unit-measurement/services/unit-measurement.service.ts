/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import {
  APIService,
  CreateUnitListInput,
  CreateUnitMeasumentInput,
  ListUnitListsQuery,
  ListUnitMeasumentsQuery,
  ModelUnitListFilterInput,
  UpdateUnitMeasumentInput,
  UpdateUnitMeasumentMutation
} from 'src/app/API.service';
import { map } from 'rxjs/operators';
import { API, graphqlOperation } from 'aws-amplify';
import { groupBy } from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class UnitMeasurementService {
  measurementList = ['Length', 'Area', 'Volume', 'Temperature'];
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
        this._ListUnitMeasuments(
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

  getSingleUnitListByName$(name: string) {
    return from(
      this.awsApiService.ListUnitLists({
        name: {
          eq: name
        }
      })
    );
  }

  CreateUnitList$(input: CreateUnitListInput) {
    return from(
      this.awsApiService.CreateUnitList({
        ...input,
        isDeleted: false
      })
    );
  }

  createUnitOfMeasurement$(input: CreateUnitMeasumentInput) {
    return from(
      this.awsApiService.CreateUnitMeasument({
        ...input,
        isDefault: false,
        isDeleted: false
      })
    );
  }

  updateUnitMeasurement$(
    input: UpdateUnitMeasumentInput
  ): Observable<UpdateUnitMeasumentMutation> {
    return from(this.awsApiService.UpdateUnitMeasument(input));
  }

  updateUnitMeasurementPromise(
    input: UpdateUnitMeasumentInput
  ): Promise<UpdateUnitMeasumentMutation> {
    return this.awsApiService.UpdateUnitMeasument(input);
  }

  private formatGraphQAssetsResponse(resp: ListUnitMeasumentsQuery) {
    const groupedData: any = groupBy(resp?.items, 'unitList.name');
    const rows = resp?.items?.map((item: any) => ({
      ...item,
      noOfUnits: groupedData[item?.unitList?.name]?.length ?? 0,
      unitType: item?.unitList?.name,
      isDefaultText: item.isDefault ? 'Default' : ''
    }));
    console.log(
      '🚀 ~ file: unit-measurement.service.ts:64 ~ UnitMeasurementService ~ rows ~ rows',
      rows
    );
    const count = rows?.length || 0;
    const nextToken = resp?.nextToken;
    return {
      count,
      rows,
      nextToken
    };
  }

  private async _ListUnitMeasuments(
    filter?: ModelUnitListFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListUnitMeasumentsQuery> {
    const statement = `query ListUnitMeasuments($filter: ModelUnitMeasumentFilterInput, $limit: Int, $nextToken: String) {
        listUnitMeasuments(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            description
            symbol
            isDefault
            isDeleted
            unitlistID
            searchTerm
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            unitList {
              name
              isDeleted
              id
              _deleted
              _lastChangedAt
              _version
              createdAt
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
    return response?.data?.listUnitMeasuments as ListUnitMeasumentsQuery;
  }

  // private async _ListUnitLists(
  //   filter?: ModelUnitListFilterInput,
  //   limit?: number,
  //   nextToken?: string
  // ): Promise<ListUnitListsQuery> {
  //   const statement = `query ListUnitLists($filter: ModelUnitListFilterInput, $limit: Int, $nextToken: String) {
  //       listUnitLists(filter: $filter, limit: $limit, nextToken: $nextToken) {
  //         __typename
  //         items {
  //           __typename
  //           id
  //           name
  //           searchTerm
  //           isDeleted
  //           createdAt
  //           updatedAt
  //           _version
  //           unitMeasuments(filter: {isDeleted: {eq: false}}) {
  //             items {
  //               description
  //               createdAt
  //               id
  //               isDefault
  //               isDeleted
  //               symbol
  //               unitlistID
  //             }
  //           }
  //         }
  //         nextToken
  //         startedAt
  //       }
  //     }`;
  //   const gqlAPIServiceArguments: any = {};
  //   if (filter) {
  //     gqlAPIServiceArguments.filter = filter;
  //   }
  //   if (limit) {
  //     gqlAPIServiceArguments.limit = limit;
  //   }
  //   if (nextToken) {
  //     gqlAPIServiceArguments.nextToken = nextToken;
  //   }
  //   const response = (await API.graphql(
  //     graphqlOperation(statement, gqlAPIServiceArguments)
  //   )) as any;
  //   return response?.data?.listUnitLists as ListUnitListsQuery;
  // }
}
