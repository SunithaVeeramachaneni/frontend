export interface CreateResponseSet {
  responseType: string;
  name: string;
  description?: string;
  isMultiColumn: boolean;
  values: string;
  createdBy: string;
}

export interface UpdateResponseSet extends CreateResponseSet {
  id: string;
  version: number;
}

export interface DeleteResponseSet {
  id: string;
  version: number;
}
