import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import * as hash from 'object-hash';
import { Tenant } from 'src/app/interfaces';
import { CommonService } from 'src/app/shared/services/common.service';
import { TenantService } from '../tenant-management/services/tenant.service';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  returnUrl: string;
  tenantInfo: Tenant;

  constructor(
    private oidcSecurityService: OidcSecurityService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private tenantService: TenantService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.loginService.setUserAuthenticated(false);
    const returnUrl = this.route.snapshot.queryParams.returnUrl;
    this.returnUrl = returnUrl ? returnUrl : '';
    this.tenantInfo = this.tenantService.getTenantInfo();
    if (this.tenantInfo && Object.keys(this.tenantInfo).length) {
      this.redirectToTenantIdp();
    }
  }

  singleSignOn() {
    this.redirectToTenantIdp();
  }

  redirectToTenantIdp() {
    const { tenantId: configId, protectedResources } = this.tenantInfo;
    const { node, sap } = protectedResources || {};

    sessionStorage.removeItem(hash(node.urls));
    sessionStorage.removeItem(hash(sap.urls));

    this.commonService.setProtectedResources(node);
    this.commonService.setProtectedResources(sap);
    sessionStorage.setItem('returnUrl', this.returnUrl);
    this.oidcSecurityService.authorize(configId);
  }
}
