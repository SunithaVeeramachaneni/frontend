export interface GetLocations {
  searchTerm?: FilterInput;
}

export interface CreateLocation {
  name: string;
  description?: string;
  model?: string;
  locationId: string;
  parentId?: string;
  image?: string;
  searchTerm?: string;
}

export interface DeleteLocation {
  id: string;
  _version: number;
}

export interface LocationsResponse {
  items: Array<{
    image?: string;
    createdAt: string;
  } | null>;
  nextToken?: string;
}

export interface FilterInput {
  ne?: string;
  eq?: string;
  le?: string;
  lt?: string;
  ge?: string;
  gt?: string;
  contains?: string;
  notContains?: string;
}
