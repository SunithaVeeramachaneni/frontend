import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  DeleteFile,
  GetFile
} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private apiUrl: string;
  private abapApiUrl: string;

  constructor(private http: HttpClient) { }

  /**
   * Will prepare http header data and returns
   *
   * @param  {boolean} {displayToast
   * @param  {string | {} | []} failureResponse}
   *
   * @returns { headers: HttpHeaders }
   */
  private getHttpOptions = ({ displayToast, failureResponse }: ErrorInfo): {headers: HttpHeaders} => {
    return {
      headers: new HttpHeaders({
        info: JSON.stringify({
          displayToast,
          failureResponse
        })
      })
    };
  }

  /**
   * Sets apiUrl private variable
   *
   * @param  {string} apiUrl
   *
   * @returns string
   */
   public setApiUrl = (apiUrl: string): void => {
    this.apiUrl = apiUrl;
  }

  /**
   * Sets abapApiUrl private variable
   *
   * @param  {string} abapApiUrl
   *
   * @returns string
   */
   public setAbapApiUrl = (abapApiUrl: string): void => {
    this.abapApiUrl = abapApiUrl;
  }

  /**
   * Prepare http request url and returns it
   *
   * @param  {string} urlString
   *
   * @returns string
   */
  private getUrl = (urlString: string): string => {
    return `${this.apiUrl}${urlString}`;
  }

  /**
   * Prepare http request url and returns it
   *
   * @param  {string} urlString
   *
   * @returns string
   */
  private getABAPUrl = (urlString: string): string => {
    return `${this.abapApiUrl}${urlString}`;
  }

  _getResp(urlStr: string, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.getUrl(urlStr);
    const { displayToast = true, failureResponse = [] } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.get<any>(url, httpOptions);
  }

  _getRespById(urlStr: string, id: string, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.getUrl(urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.get<any>(url + id, httpOptions);
  }

  _getRespByName(urlStr: string, name: string, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.getUrl(urlStr);
    const { displayToast = true, failureResponse = [] } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.get<any>(url + name, httpOptions);
  }

  _postData(
    urlStr: string,
    data: Instruction | InstructionOptional | Step | StepOptional | User | UserOptional | Category | CategoryOptional | Mail | DeleteFile |
    FormData | GetFile,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const url = this.getUrl(urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.post<any>(url, data, httpOptions);
  }

  _updateData(urlStr: string, data: Instruction | Step | Category, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.getUrl(urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.put<any>(url, data, httpOptions);
  }

  _removeData(urlStr: string, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.getUrl(urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.delete<any>(url, httpOptions);
  }

  _removeDataFromGateway(urlStr: string, data: any, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.getABAPUrl(urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.put<any>(url, data, httpOptions); // it is update in this case not delete
  }

  _postDataToGateway(urlStr: string, data: any, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.getABAPUrl(urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.post<any>(url, data, httpOptions);
  }

  _putDataToGateway(urlStr: string, data: any, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.getABAPUrl(urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.put<any>(url, data, httpOptions);
  }

  _getRespFromGateway(urlStr: string, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.getABAPUrl(urlStr);
    const { displayToast = true, failureResponse = [] } = info;
    const httpOptions = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    return this.http.get<any>(url, httpOptions);
  }

  _getDataFromGatewayById(urlStr: string, params: any, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.getABAPUrl(urlStr);
    const { displayToast = true, failureResponse = [] } = info;
    const headers = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    const httpOptions = { ...headers, params };
    return this.http.get<any>(url, httpOptions);
  }

  _getDataFromGatewayByStep(urlStr: string, params: any, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    const url = this.getABAPUrl(urlStr);
    const { displayToast = true, failureResponse = {} } = info;
    const headers = this.getHttpOptions({
      displayToast,
      failureResponse
    });
    const httpOptions = { ...headers, params };
    return this.http.get<any>(url, httpOptions);
  }
}
