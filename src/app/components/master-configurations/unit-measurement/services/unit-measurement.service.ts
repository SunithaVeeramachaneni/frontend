import { Injectable } from '@angular/core';
import { from, of } from 'rxjs';
import { APIService, ListAssetsQuery } from 'src/app/API.service';
import { map } from 'rxjs/operators';

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
        this.awsApiService.ListAssets(
          {
            ...(queryParams.searchKey && {
              searchTerm: { contains: queryParams?.searchKey.toLowerCase() }
            })
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

  private formatGraphQAssetsResponse(resp: ListAssetsQuery) {
    const rows = [
      {
        id: 'dfgfgf',
        name: 'Length',
        noOfUnits: 4,
        units: [
          {
            id: 'ssgdgf',
            description: 'Centimeter',
            symbol: 'cm',
            isDefault: true,
            isActive: true
          },
          {
            id: 'ssgddfdgggf',
            description: 'Meter',
            symbol: 'm',
            isDefault: false,
            isActive: true
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'sdfgh',
        name: 'Area',
        noOfUnits: 2,
        units: [
          {
            id: 'ssgdgf',
            description: 'Centimeter Square',
            symbol: 'cm2',
            isDefault: false,
            isActive: true
          },
          {
            id: 'ssgddfdgggf',
            description: 'Meter Square',
            symbol: 'm2',
            isDefault: false,
            isActive: true
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    const count = rows.length || 0;
    const nextToken = resp?.nextToken;
    return {
      count,
      rows,
      nextToken
    };
  }
}
