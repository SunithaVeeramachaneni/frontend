/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import * as hash from 'object-hash';

@Injectable({ providedIn: 'root' })
export class AuthHeaderService {
  constructor(private commonService: CommonService) {}

  getAuthHeaders(requestUrl: string) {
    const { tenantId: tenantid } = this.commonService.getTenantInfo();
    const protectedResource = this.commonService
      .getProtectedResources()
      .find((_protectedResource) => {
        const { urls } = _protectedResource;
        return urls.find((url) => requestUrl.indexOf(url) > -1);
      });
    let authorization: string;
    if (protectedResource && Object.keys(protectedResource).length) {
      const { urls } = protectedResource;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { token_type, access_token } =
        JSON.parse(sessionStorage.getItem(hash(urls))) || {};
      authorization = `${token_type} ${access_token}`;
    }
    return { tenantid, authorization };
  }
}
