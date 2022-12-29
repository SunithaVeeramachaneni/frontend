import { Injectable } from '@angular/core';
import { LoginService } from 'src/app/components/login/services/login.service';
import { SSE } from 'sse.js';
import { CommonService } from './common.service';

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
    private loginService: LoginService
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
    headers: { authorization: string };
  } {
    const jwtToken = this.loginService
      .getLoggedInUserSession()
      ?.getAccessToken().jwtToken;
    return {
      payload: formData,
      method,
      headers: { authorization: `Bearer ${jwtToken}` }
    };
  }
}
