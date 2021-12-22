import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ErrorInfo,
  Instruction,
  InstructionOptional,
  Step,
  StepOptional,
  User,
  UserOptional,
  Category,
  CategoryOptional,
  Mail,
  RenameFileInfo,
  CopyFilesPathInfo
} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  /**
   * Will prepare http header data and returns
   *
   * @param  {boolean} {displayToast
   * @param  {string | {} | []} failureResponse}
   * @param  {string} contentType}
   *
   * @returns { headers: HttpHeaders }
   */
  private getHttpOptions = ({ displayToast, failureResponse, contentType = '' }: any): {headers: HttpHeaders} => {
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
  }

  /**
   * Prepare http request url and returns it
   *
   * @param  {string} urlString
   *
   * @returns string
   */
  public prepareUrl = (apiUrl: string, urlString: string): string => {
    return `${apiUrl}${urlString}`;
  }

  _getResp(apiUrl: string, urlStr: string, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = [] } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.get<any>(url, httpOptions);
  }

  _getRespById(apiUrl: string, urlStr: string, id: string, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.get<any>(url + id, httpOptions);
  }

  _getRespByName(apiUrl: string, urlStr: string, name: string, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
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
    data: Instruction | InstructionOptional | Step | StepOptional | User | UserOptional | Category | CategoryOptional | Mail | FormData | CopyFilesPathInfo,
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

  _updateData(apiUrl: string, urlStr: string, data: Instruction | Step | Category | RenameFileInfo, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.put<any>(url, data, httpOptions);
  }

  _removeData(apiUrl: string, urlStr: string, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.delete<any>(url, httpOptions);
  }

  _removeDataFromGateway(apiUrl: string, urlStr: string, data: any, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.put<any>(url, data, httpOptions); // it is update in this case not delete
  }

  _postDataToGateway(apiUrl: string, urlStr: string, data: any, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.post<any>(url, data, httpOptions);
  }

  _putDataToGateway(apiUrl: string, urlStr: string, data: any, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.put<any>(url, data, httpOptions);
  }

  _getRespFromGateway(apiUrl: string, urlStr: string, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = [] } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.get<any>(url, httpOptions);
  }

  _getDataFromGatewayById(apiUrl: string, urlStr: string, params: any, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = [] } = info;
    const headers = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    const httpOptions = { ...headers, params };
    return this.http.get<any>(url, httpOptions);
  }

  _getDataFromGatewayByStep(apiUrl: string, urlStr: string, params: any, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.prepareUrl(apiUrl, urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const headers = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    const httpOptions = { ...headers, params };
    return this.http.get<any>(url, httpOptions);
  }

  postRefreshToken(tokenEndPoint: string, data: any, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const body = new HttpParams({ fromObject: data });
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse,
      contentType : 'application/x-www-form-urlencoded'
    });
    return this.http.post<any>(tokenEndPoint, body, httpOptions);
  }
}
