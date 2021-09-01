import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
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
  private _headers: { [name: string]: any; } | null | undefined;
  public token: string | null;
  public auth: string;
  public authType = 'Basic ';

  constructor(private http: HttpClient) {
    // this.token = localStorage.getItem('key');
    // this.auth = this.authType + this.token;
    this._headers = new HttpHeaders();
    this._headers.append('Authorization', '');
    this._headers.append('Content-Type', 'application/json');
  }

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
   * Prepare http request url and returns it
   *
   * @param  {string} urlString
   *
   * @returns string
   */
  private getUrl = (urlString: string): string => {
    return `${environment.wiApiUrl}${urlString}`;
  }

  /**
   * Prepare http request url and returns it
   *
   * @param  {string} urlString
   *
   * @returns string
   */
  private getABAPUrl = (urlString: string): string => {
    return `${environment.wiAbapApiUrl}${urlString}`;
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
