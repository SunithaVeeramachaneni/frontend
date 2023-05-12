export interface UnitOfMeasurementList {
  items: Array<UnitOfMeasurement | null>;
  next?: string | null;
  startedAt?: number | null;
}

export interface UnitOfMeasurement {
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
}
