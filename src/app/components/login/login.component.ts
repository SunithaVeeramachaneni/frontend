import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as hash from 'object-hash';
import { Tenant } from 'src/app/interfaces';
import { CommonService } from 'src/app/shared/services/common.service';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { TenantService } from '../tenant-management/services/tenant.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string;
  tenantsInfo$: Observable<Tenant[]>;

  constructor(
    private fb: FormBuilder,
    private oidcSecurityService: OidcSecurityService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private tenantService: TenantService
  ) {}

  ngOnInit() {
    const returnUrl = this.route.snapshot.queryParams.returnUrl;
    this.returnUrl = returnUrl ? returnUrl : '';
    this.loginForm = this.fb.group({
      companyOrDomainName: [
        '',
        [
          Validators.required,
          WhiteSpaceValidator.noWhiteSpace,
          this.companyOrDomaniNameValidator()
        ]
      ]
    });

    this.tenantsInfo$ = this.loginForm
      .get('companyOrDomainName')
      .valueChanges.pipe(
        map((value) => {
          if (value.trim()) {
            return this.tenantService
              .getTenantsInfo()
              .filter(
                ({ tenantName, tenantDomainName }) =>
                  tenantName.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
                  tenantDomainName.toLowerCase().indexOf(value.toLowerCase()) >
                    -1
              );
          } else {
            return [];
          }
        })
      );

    const companyOrDomainName = sessionStorage.getItem('companyOrDomainName');
    if (companyOrDomainName) {
      this.loginForm.setValue({ companyOrDomainName });
      this.loginForm.markAsDirty();
      this.redirectToTenantIdp();
    }
  }

  redirectToTenantIdp() {
    if (this.loginForm.valid && this.loginForm.dirty) {
      let { companyOrDomainName } = this.loginForm.value;
      companyOrDomainName = companyOrDomainName.trim().toLowerCase();
      const tenantInfo = this.tenantService.getTenantsInfo().find((tenant) => {
        const { tenantName, tenantDomainName } = tenant;
        return (
          tenantName.trim().toLowerCase() === companyOrDomainName ||
          tenantDomainName.trim().toLowerCase() === companyOrDomainName
        );
      });
      const { tenantId: configId, protectedResources } = tenantInfo;
      const { node, sap } = protectedResources || {};

      sessionStorage.removeItem(hash(node.urls));
      sessionStorage.removeItem(hash(sap.urls));

      this.commonService.setProtectedResources(node);
      this.commonService.setProtectedResources(sap);
      this.tenantService.setTenantInfo(tenantInfo);
      sessionStorage.setItem('companyOrDomainName', companyOrDomainName);
      sessionStorage.setItem('returnUrl', this.returnUrl);
      this.oidcSecurityService.authorize(configId);
    }
  }

  companyOrDomaniNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let value = control.value as string;
      if (value) {
        value = value.trim().toLowerCase();
        const tenantInfo = this.tenantService
          .getTenantsInfo()
          .find((tenant) => {
            const { tenantName, tenantDomainName } = tenant;
            return (
              tenantName.trim().toLowerCase() === value ||
              tenantDomainName.trim().toLowerCase() === value
            );
          });
        return tenantInfo ? null : { invalidCompanyOrDomaniName: true };
      }
      return null;
    };
  }

  onEnter() {
    this.loginForm.get('companyOrDomainName').markAsTouched();
  }
}
