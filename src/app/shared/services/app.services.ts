/* eslint-disable @typescript-eslint/member-ordering */
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ErrorInfo } from '../../interfaces';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {}

  private getHttpOptions = ({
    displayToast,
    failureResponse,
    contentType = ''
  }: any): { headers: HttpHeaders } => {
    if (contentType) {
      return {
        headers: new HttpHeaders({
          info: JSON.stringify({ displayToast, failureResponse }),
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': window.location.origin
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

  public prepareUrl = (apiUrl: string, urlString: string): string =>
    `${
      apiUrl.indexOf('http://localhost') !== -1
        ? `${apiUrl}`
        : `https://cbotademo.innovapptive.com${apiUrl}`
    }${urlString}`;

  _getResp(
    apiUrl: string,
    urlString: string,
    info: ErrorInfo = {} as ErrorInfo,
    queryParams: any = {}
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlString);
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
    urlString: string,
    id: string | number,
    info: ErrorInfo = {} as ErrorInfo,
    queryParams: any = {}
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlString);
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
    urlString: string,
    formData: FormData,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlString);
    return this.http.post<any>(url, formData);
  }

  downloadFile(
    apiUrl: string,
    urlString: string,
    info: ErrorInfo = {} as ErrorInfo,
    isGetRequest: boolean = true,
    data: any = {},
    customResponseType: string = ''
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlString);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });

    let responseType: any = 'blob' as 'json';
    if (customResponseType && customResponseType.length) {
      responseType = customResponseType;
    }
    if (isGetRequest) {
      return this.http.get<any>(url, {
        ...httpOptions,
        responseType
      });
    }
    return this.http.post<any>(url, data, {
      ...httpOptions,
      responseType: 'blob' as 'json'
    });
  }

  downloadWithPost(
    apiUrl: string,
    urlString: string,
    info: ErrorInfo = {} as ErrorInfo,
    data: any = {},
    customResponseType: string = '',
    customHeaders: any = {}
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlString);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse,
      ...customHeaders
    });
    return this.http.post<any>(url, data, {
      ...httpOptions,
      responseType: customResponseType as 'json'
    });
  }

  _getRespByName(
    apiUrl: string,
    urlString: string,
    name: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlString);
    const { displayToast = true, failureResponse = [] } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.get<any>(url + name, httpOptions);
  }

  _postData(
    apiUrl: string,
    urlString: string,
    data: any,
    info: ErrorInfo = {} as ErrorInfo,
    queryParams: any = {}
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlString);
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
    urlString: string,
    data: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlString);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.put<any>(url, data, httpOptions);
  }

  patchData(
    apiUrl: string,
    urlString: string,
    data: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlString);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.patch<any>(url, data, httpOptions);
  }

  _removeData(
    apiUrl: string,
    urlString: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlString);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.delete<any>(url, httpOptions);
  }

  _removeDataFromGateway(
    apiUrl: string,
    urlString: string,
    data: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlString);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.put<any>(url, data, httpOptions); // it is update in this case not delete
  }

  _postDataToGateway(
    apiUrl: string,
    urlString: string,
    data: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlString);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.post<any>(url, data, httpOptions);
  }

  _putDataToGateway(
    apiUrl: string,
    urlString: string,
    data: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlString);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.put<any>(url, data, httpOptions);
  }

  _getRespFromGateway(
    apiUrl: string,
    urlString: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlString);
    const { displayToast = true, failureResponse = [] } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.get<any>(url, httpOptions);
  }

  _getLocal(
    apiUrl: string,
    urlString: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlString);
    const { displayToast = true, failureResponse = [] } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.get<any>(url, httpOptions);
  }

  _getDataFromGatewayById(
    apiUrl: string,
    urlString: string,
    params: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlString);
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
    urlString: string,
    params: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlString);
    const { displayToast = true, failureResponse = {} } = info;
    const headers = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    const httpOptions = { ...headers, params };
    return this.http.get<any>(url, httpOptions);
  }

  getAccessTokenUsingRefreshToken(
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
