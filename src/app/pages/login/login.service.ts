import { Injectable } from "@angular/core"
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { ErrorInfo } from "../../interfaces/error-info";
import { IdpConfig } from "../../interfaces/idpconfig";
import { AppService } from "../../shared/services/app.services";

@Injectable({ providedIn: "root" })
export class LoginService {

  constructor(private _appService: AppService) { }

  getIdpConfig(userEmail,info: ErrorInfo = {} as ErrorInfo):Observable<IdpConfig>{
    let userInfo$ = this._appService._getRespFromGateway(environment.spccAbapApiUrl,`user/${userEmail}`, info);
    let transformedObservable$ = userInfo$.pipe(map(rawIdpConfig => {
        let idpConfig: IdpConfig;
        let tenatConfig =rawIdpConfig['tenant'][0];
        idpConfig = ({
            authority:tenatConfig.authority ,
            authWellknownEndpointUrl: tenatConfig.authority,
            redirectUrl: tenatConfig.redirectUri,
            clientId: tenatConfig.clientId,
            scope: "openid profile offline_access email api://06a96c09-45cc-4120-8f96-9c0a0d89d6bc/scp.access",
            responseType: "code",
            silentRenew: true,
            maxIdTokenIatOffsetAllowedInSeconds: 600,
            issValidationOff: true,
            autoUserInfo: false,
            useRefreshToken: true,
            logLevel:1,
            secureRoutes:tenatConfig.secureRoutes,
            customParamsAuthRequest:{
                prompt:"select_account"
            }

         })
      return idpConfig;
    }))
    return transformedObservable$;
  }
  assignTechnicianToWorkorder(data,info: ErrorInfo = {} as ErrorInfo):Observable<any>{
    let updateResp$ = this._appService._putDataToGateway(environment.spccAbapApiUrl,`workorderspcc/${data.AUFNR}`,data);
    return updateResp$;
  }

}