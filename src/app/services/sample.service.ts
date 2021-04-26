import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {catchError, map, mergeMap, switchMap, tap, toArray} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';



@Injectable({
  providedIn: 'root'
})
export class SampleService {
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

  _postData(urlStr, data): Observable<any> {
    let url = '';
    url = 'https://invamdemo-dbapi.innovapptive.com/';
    return this.http.post(url, data).pipe(map((res: HttpResponse<any>) => {
        return res;
      }),
      catchError((error: any) => of([])));
  }
}
