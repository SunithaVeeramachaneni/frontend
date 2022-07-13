/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { ConfigUserDataResult } from 'angular-auth-oidc-client';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private isUserAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isUserAuthenticated$ = this.isUserAuthenticatedSubject.asObservable();

  constructor(private commonService: CommonService) {}

  setUserAuthenticated(isUserAuthenticated: boolean) {
    this.isUserAuthenticatedSubject.next(isUserAuthenticated);
  }

  performPostLoginActions = (
    configUserDataResult: ConfigUserDataResult,
    configIds: string[]
  ) => {
    const { configId } = configUserDataResult;
    const tenantInfo = this.commonService
      .getTenantsInfo()
      .find((tenant) => tenant.tenantId === configId);
    const { protectedResources } = tenantInfo;
    const { node, sap } = protectedResources || {};

    this.commonService.setTenantInfo(tenantInfo);
    this.commonService.setProtectedResources(node);
    this.commonService.setProtectedResources(sap);
    this.setUserAuthenticated(true);

    configIds.forEach((key) => sessionStorage.removeItem(key));
  };
}
