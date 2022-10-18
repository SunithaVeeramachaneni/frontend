export interface CreateUpdateResponse {
  type: 'create' | 'update' | 'cancel';
  responseType?: string;
  response: any;
}
