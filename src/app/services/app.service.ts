import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ErrorInfo } from '../interfaces/error-info';

@Injectable()
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
    private getHttpOptions = ({ displayToast, failureResponse }: ErrorInfo): { headers: HttpHeaders } => {
        return {
            headers: new HttpHeaders({
                info: JSON.stringify({
                    displayToast,
                    failureResponse
                })
            },
            )
        };
    }

    private getABAPUrl = (urlString: string): string => {
        return `http://localhost:8000/abapapi/${urlString}`;
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
}

