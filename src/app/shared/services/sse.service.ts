import { Injectable } from '@angular/core';
import { SSE } from 'sse.js';
import { CommonService } from './common.service';
import * as hash from 'object-hash';
import { TenantService } from 'src/app/components/tenant-management/services/tenant.service';

@Injectable({
  providedIn: 'root'
})

/**
 * Server-Sent Event Service
 */
export class SseService {
  eventSource: SSE;

  constructor(
    private commonService: CommonService,
    private tenantService: TenantService
  ) {}

  /**
   * Create an event source of POST request
   *
   * @param API url
   * @formData data (file, ...etc.)
   */
  public getEventSourceWithPost(url: string, formData: FormData): SSE {
    return this.buildEventSource(url, 'POST', formData);
  }

  /**
   * Create an event source of GET request
   *
   * @param API url
   * @formData data (file, ...etc.)
   */
  public getEventSourceWithGet(url: string, formData: FormData): SSE {
    return this.buildEventSource(url, 'GET', formData);
  }

  /**
   * close connection
   */
  public closeEventSource() {
    if (!!this.eventSource) {
      this.eventSource.close();
    }
  }

  /**
   * Building the event source
   *
   * @param url  API URL
   * @param meth  (POST, GET, ...etc.)
   * @param formData data
   */
  private buildEventSource(
    url: string,
    method: string,
    formData: FormData
  ): SSE {
    const options = this.buildOptions(url, method, formData);
    this.eventSource = new SSE(url, options);
    return this.eventSource;
  }

  /**
   * Build query options
   *
   * @param method POST or GET
   * @param formData data
   */
  private buildOptions(
    url: string,
    method: string,
    formData: FormData
  ): {
    payload: FormData;
    method: string;
    headers: { authorization: string; tenantid: string };
  } {
    const { tenantId: tenantid } = this.tenantService.getTenantInfo();
    const protectedResource = this.getProtectedResource(url);
    let authorization: string;
    if (protectedResource && Object.keys(protectedResource).length) {
      const { urls } = protectedResource;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { token_type, access_token } =
        JSON.parse(sessionStorage.getItem(hash(urls))) || {};
      authorization = `${token_type} ${access_token}`;
    }
    return {
      payload: formData,
      method,
      headers: { tenantid, authorization }
    };
  }

  private getProtectedResource(requestUrl: string) {
    return this.commonService
      .getProtectedResources()
      .find((protectedResource) => {
        const { urls } = protectedResource;
        return urls.find((url) => requestUrl.indexOf(url) > -1);
      });
  }
}
