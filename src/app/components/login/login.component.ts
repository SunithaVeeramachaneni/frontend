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
import { CommonService } from 'src/app/shared/services/common.service';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private oidcSecurityService: OidcSecurityService,
    private commonService: CommonService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl;
    this.loginForm = this.fb.group({
      companyOrDomainName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.noWhiteSpace,
          this.companyOrDomaniNameValidator()
        ]
      ]
    });

    const companyOrDomainName = sessionStorage.getItem('companyOrDomainName');
    if (companyOrDomainName) {
      this.loginForm.setValue({ companyOrDomainName });
      this.loginForm.markAsDirty();
      this.redirectToTenant();
    }
  }

  redirectToTenant() {
    if (this.loginForm.valid && this.loginForm.dirty) {
      let { companyOrDomainName } = this.loginForm.value;
      companyOrDomainName = companyOrDomainName.trim().toLowerCase();
      const tenantInfo = this.commonService.getTenantsInfo().find((tenant) => {
        const { tenantName, tenantDomainName } = tenant;
        return (
          tenantName.trim().toLowerCase() === companyOrDomainName ||
          tenantDomainName.trim().toLowerCase() === companyOrDomainName
        );
      });
      const { tenantId: configId, protectedResources } = tenantInfo;
      const { node, sap } = protectedResources || {};

      this.commonService.setProtectedResources(node);
      this.commonService.setProtectedResources(sap);
      this.commonService.setTenantInfo(tenantInfo);
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
        const tenantInfo = this.commonService
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
