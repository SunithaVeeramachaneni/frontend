/* eslint-disable @typescript-eslint/naming-convention */
export type ListUnitMeasumentsQuery = {
  __typename: 'ModelUnitMeasumentConnection';
  items: Array<{
    __typename: 'UnitMeasument';
    id: string;
    description?: string | null;
    symbol?: string | null;
    isDefault?: boolean | null;
    isDeleted?: boolean | null;
    unitlistID: string;
    searchTerm?: string | null;
    isActive?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetUnitMeasumentQuery = {
  __typename: 'UnitMeasument';
  id: string;
  description?: string | null;
  symbol?: string | null;
  isDefault?: boolean | null;
  isDeleted?: boolean | null;
  unitlistID: string;
  searchTerm?: string | null;
  unitList?: {
    __typename: 'UnitList';
    id: string;
    name?: string | null;
    isDeleted?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};
