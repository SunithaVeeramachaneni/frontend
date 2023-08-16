export interface GetAssets {
  searchTerm?: FilterInput;
}

export interface CreateAssets {
  name: string;
  description?: string;
  model?: string;
  parentType?: string;
  parentId?: string;
  assetsId: string;
  image?: string;
  plantsID?: string;
  searchTerm?: string;
}

export interface DeleteAssets {
  id: string;
  _version: number;
}

export interface AssetsResponse {
  items: Array<{
    image?: string;
    createdAt: string;
  } | null>;
  next?: string;
  count?: number;
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
