import { Injectable } from '@angular/core';
import { SSE } from 'sse.js';

@Injectable({
  providedIn: 'root'
})

/**
 * Server-Sent Event Service
 */
export class SseService {
  eventSource: SSE;

  constructor() {}

  /**
   * Create an event source of POST request
   * @param API url
   * @formData data (file, ...etc.)
   */
  public getEventSourceWithPost(url: string, formData: FormData): SSE {
    return this.buildEventSource(url, 'POST', formData);
  }

  /**
   * Create an event source of GET request
   * @param API url
   * @formData data (file, ...etc.)
   */
  public getEventSourceWithGet(url: string, formData: FormData): SSE {
    return this.buildEventSource(url, 'GET', formData);
  }

  /**
   * Building the event source
   * @param url  API URL
   * @param meth  (POST, GET, ...etc.)
   * @param formData data
   */
  private buildEventSource(url: string, meth: string, formData: FormData): SSE {
    const options = this.buildOptions(meth, formData);
    this.eventSource = new SSE(url, options);
    return  this.eventSource;
  }

  /**
   * close connection
   */
  public closeEventSource() {
    if (!! this.eventSource) {
       this.eventSource.close();
    }
  }

  /**
   * checks authorization code
   *
   * @returns string
   */
  protected checkAuthorization(): string {
    return '';
  }

  /**
   * Build query options
   * @param method POST or GET
   * @param formData data
   */
  private buildOptions(method: string, formData: FormData): {
    payload: FormData;
    method: string;
    headers: string | { Authorization: string };
  } {
    const auth = this.checkAuthorization();
    return {
      payload: formData,
      method,
      headers: auth !== '' ? { Authorization: auth } : '',
    };
  }
}
