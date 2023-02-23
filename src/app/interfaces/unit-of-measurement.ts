/* eslint-disable @typescript-eslint/naming-convention */
export type ListUnitMeasumentsQuery = {
  items: Array<{
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
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetUnitMeasumentQuery = {
  id: string;
  description?: string | null;
  symbol?: string | null;
  isDefault?: boolean | null;
  isDeleted?: boolean | null;
  unitlistID: string;
  searchTerm?: string | null;
  unitList?: {
    id: string;
    name?: string | null;
    isDeleted?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
  } | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
};
