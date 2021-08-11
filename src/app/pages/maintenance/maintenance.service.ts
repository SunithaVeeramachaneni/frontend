import { Injectable } from "@angular/core"
import { Observable } from "rxjs";
import { ErrorInfo } from "../../interfaces/error-info";
import { AppService } from "../../services/app.service"

@Injectable({providedIn: "root"})
export class MaintenanceService {

  constructor(private _appService: AppService) {}

  
getAllWorkOrders(pagination: boolean = true,info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    return this._appService._getRespFromGateway('workOrdersAndOperations', info);
  }


}
