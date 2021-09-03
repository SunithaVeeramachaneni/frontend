import { Injectable } from "@angular/core"
import { Observable } from "rxjs";
import { ErrorInfo } from "../../interfaces/error-info";
import { AppService } from "../../shared/services/app.services"
import { environment } from "../../../environments/environment";

@Injectable({providedIn: "root"})
export class HeaderService {

  constructor(private _appService: AppService) {}

  getLogonUserDetails(info: ErrorInfo = {} as ErrorInfo): Observable<any[]>{
    return this._appService._getRespFromGateway(environment.mccAbapApiUrl, 'logonUserDetails', { displayToast, failureResponse });
  }
}
