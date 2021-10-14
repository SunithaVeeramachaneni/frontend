export interface IdpConfig {
    authority: string;
    authWellknownEndpointUrl: string;
    redirectUrl: string;
    clientId: string;
    scope: string;
    responseType: string;
    silentRenew: boolean;
    maxIdTokenIatOffsetAllowedInSeconds: number;
    issValidationOff: boolean;
    autoUserInfo: boolean;
    useRefreshToken: boolean;
    logLevel:number;
    secureRoutes:Array<string>;
    customParamsAuthRequest:{
        prompt:string;
    }
  }