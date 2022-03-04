import { of } from 'rxjs';

export const dashboards = [
  {
    name: 'Dashboard 1',
    isDefault: true,
    createdBy: 'kiran palani',
    updatedBy: null,
    updatedOn: null,
    createdOn: '2022-02-26T11:48:54.809Z',
    id: '621a13a6dd5c1cfc5a1a477e'
  }
];

export const dashboards$ = of(dashboards);
