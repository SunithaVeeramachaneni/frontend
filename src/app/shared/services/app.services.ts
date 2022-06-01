/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ErrorInfo } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private http: HttpClient) {}

  /**
   * Will prepare http header data and returns
   *
   * @param  {boolean} {displayToast
   * @param  {string | {} | []} failureResponse}
   * @param  {string} contentType}
   *
   * @returns { headers: HttpHeaders }
   */
  private getHttpOptions = ({
    displayToast,
    failureResponse,
    contentType = ''
  }: any): { headers: HttpHeaders } => {
    if (contentType) {
      return {
        headers: new HttpHeaders({
          info: JSON.stringify({ displayToast, failureResponse }),
          'Content-Type': contentType
        })
      };
    } else {
      return {
        headers: new HttpHeaders({
          info: JSON.stringify({ displayToast, failureResponse })
        })
      };
    }
  };

  /**
   * Prepare http request url and returns it
   *
   * @param  {string} urlString
   *
   * @returns string
   */
  public prepareUrl = (apiUrl: string, urlString: string): string => {
    return `${apiUrl}${urlString}`;
  };

  _getResp(
    apiUrl: string,
    urlStr: string,
    info: ErrorInfo = {} as ErrorInfo,
    queryParams: any = {}
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = [] } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.get<any>(
      url + this.getQueryString(queryParams),
      httpOptions
    );
  }

  _getRespById(
    apiUrl: string,
    urlStr: string,
    id: string | number,
    info: ErrorInfo = {} as ErrorInfo,
    queryParams: any = {}
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.get<any>(
      url + id + this.getQueryString(queryParams),
      httpOptions
    );
  }

  uploadFile(
    apiUrl: string,
    urlStr: string,
    formData: FormData,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    return this.http.post<any>(url, formData);
  }

  _downloadFile(
    apiUrl: string,
    urlStr: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.get<any>(url, {
      ...httpOptions,
      responseType: 'blob' as 'json'
    });
  }

  _getRespByName(
    apiUrl: string,
    urlStr: string,
    name: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = [] } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.get<any>(url + name, httpOptions);
  }

  _postData(
    apiUrl: string,
    urlStr: string,
    data: any,
    info: ErrorInfo = {} as ErrorInfo,
    queryParams: any = {}
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.post<any>(
      url + this.getQueryString(queryParams),
      data,
      httpOptions
    );
  }

  _updateData(
    apiUrl: string,
    urlStr: string,
    data: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.put<any>(url, data, httpOptions);
  }

  patchData(
    apiUrl: string,
    urlStr: string,
    data: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.patch<any>(url, data, httpOptions);
  }

  _removeData(
    apiUrl: string,
    urlStr: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.delete<any>(url, httpOptions);
  }

  _removeDataFromGateway(
    apiUrl: string,
    urlStr: string,
    data: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.put<any>(url, data, httpOptions); // it is update in this case not delete
  }

  _postDataToGateway(
    apiUrl: string,
    urlStr: string,
    data: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.post<any>(url, data, httpOptions);
  }

  _putDataToGateway(
    apiUrl: string,
    urlStr: string,
    data: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.put<any>(url, data, httpOptions);
  }

  _getRespFromGateway(
    apiUrl: string,
    urlStr: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = [] } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.get<any>(url, httpOptions);
  }

  _getDataFromGatewayById(
    apiUrl: string,
    urlStr: string,
    params: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = [] } = info;
    const headers = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    const httpOptions = { ...headers, params };
    return this.http.get<any>(url, httpOptions);
  }

  _getDataFromGatewayByStep(
    apiUrl: string,
    urlStr: string,
    params: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const headers = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    const httpOptions = { ...headers, params };
    return this.http.get<any>(url, httpOptions);
  }

  postRefreshToken(
    tokenEndPoint: string,
    data: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const body = new HttpParams({ fromObject: data });
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse,
      contentType: 'application/x-www-form-urlencoded'
    });
    return this.http.post<any>(tokenEndPoint, body, httpOptions);
  }

  private getQueryString(queryParams: any): string {
    const queryString = Object.keys(queryParams)
      .map((param) => `${param}=${queryParams[param]}`)
      .join('&');
    return queryString ? `?${queryString}` : queryString;
  }
}
