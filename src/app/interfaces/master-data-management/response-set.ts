export interface CreateResponseSet {
  name: string;
  description?: string;
  refCount: number;
  isMultiColumn: boolean;
  values: string;
}

export interface UpdateResponseSet extends CreateResponseSet {
  id: string;
  createdBy: string;
  version: number;
}

export interface DeleteResponseSet {
  id: string;
  _version: number;
}
