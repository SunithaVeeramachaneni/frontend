import { Injectable } from "@angular/core"
import { Observable } from "rxjs";
import { ErrorInfo } from "../../interfaces/error-info";
import { AppService } from "../../services/app.service"

@Injectable({providedIn: "root"})
export class HeaderService {

  constructor(private _appService: AppService) {}

getLogonUserDetails(info: ErrorInfo = {} as ErrorInfo): Observable<any[]>{
    const { displayToast, failureResponse = [] } = info;
    return this._appService._getRespFromGateway('logonUserDetails', { displayToast, failureResponse });
  }
}
