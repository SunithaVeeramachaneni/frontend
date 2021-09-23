import { Injectable } from "@angular/core"
import { Observable } from "rxjs";
import { ErrorInfo } from "../../interfaces/error-info";
import { AppService } from "../../shared/services/app.services"
import { environment } from "../../../environments/environment";
import { map, shareReplay } from "rxjs/operators";
import { LogonUserDetails } from "../../interfaces";

@Injectable({providedIn: "root"})

export class HeaderService {

  logonUserDetails: Observable<LogonUserDetails>;

  constructor(private _appService: AppService) {}

  getLogonUserDetails(info: ErrorInfo = {} as ErrorInfo): Observable<any>{
    if (!this.logonUserDetails) {
      this.logonUserDetails = this._appService._getRespFromGateway(environment.mccAbapApiUrl, 'logonUserDetails', info)
        .pipe(
          map(data => {
            let userImage = '', userName = '';
            if (data.length) {
              const { FILECONTENT, SHORT } = data[0];
              userImage =  `data:image/jpeg;base64,${FILECONTENT}`;
              userName =  SHORT;
            }
            return { userImage, userName };
          }),
          shareReplay(1)
        );
    }
    return this.logonUserDetails;
  }

  clearCache() {
    this.logonUserDetails = null;
  }
}
