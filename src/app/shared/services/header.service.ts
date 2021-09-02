import { Injectable } from "@angular/core"
import { Observable } from "rxjs";
import { ErrorInfo } from "../../interfaces/error-info";
import { AppService } from "../../shared/services/app.services"
import { environment } from "../../../environments/environment";

@Injectable({providedIn: "root"})
export class HeaderService {

  constructor(private _appService: AppService) {
    this._appService.setAbapApiUrl(environment.mccAbapApiUrl);
  }

getLogonUserDetails(info: ErrorInfo = {} as ErrorInfo): Observable<any[]>{
    const { displayToast, failureResponse = [] } = info;
    return this._appService._getRespFromGateway('logonUserDetails', { displayToast, failureResponse });
  }
}
