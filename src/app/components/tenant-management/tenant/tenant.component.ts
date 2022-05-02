import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantComponent implements OnInit {
  tenantForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.tenantForm = this.fb.group({
      tenantId: ['', [Validators.required, Validators.maxLength(100)]],
      tenantName: ['', [Validators.required, Validators.maxLength(100)]],
      tenantIdp: ['', [Validators.required]],
      clientId: ['', [Validators.required, Validators.maxLength(100)]],
      authority: ['', [Validators.required, Validators.maxLength(255)]],
      redirectUri: ['', [Validators.required, Validators.maxLength(100)]],
      tenantDomainName: ['', [Validators.required, Validators.maxLength(100)]],
      tenantAdmin: this.fb.group({
        firstName: ['', [Validators.required, , Validators.maxLength(100)]],
        lastName: ['', [Validators.required, Validators.maxLength(100)]],
        title: ['', [Validators.required, Validators.maxLength(100)]],
        email: [
          '',
          [Validators.required, Validators.maxLength(100), Validators.email]
        ]
      }),
      erps: this.fb.group({
        sap: this.buildErps()
      }),
      protectedResources: this.fb.group({
        sap: this.buildProtectedResources(),
        node: this.buildProtectedResources()
      }),
      rdbms: this.fb.group({
        host: ['', [Validators.required]],
        port: ['', [Validators.required]],
        user: ['', [Validators.required]],
        password: ['', [Validators.required]],
        database: ['', [Validators.required]],
        dialect: ['', [Validators.required]]
      }),
      nosql: this.fb.group({
        host: ['', [Validators.required]],
        port: ['', [Validators.required]],
        user: ['', [Validators.required]],
        password: ['', [Validators.required]],
        database: ['', [Validators.required]]
      }),
      licenseInfo: this.fb.group({
        start: ['', [Validators.required]],
        end: ['', [Validators.required]],
        count: ['', [Validators.required]]
      }),
      products: this.fb.array([], [Validators.required]),
      modules: this.fb.array([], [Validators.required]),
      logDBType: ['', [Validators.required]],
      logLevel: ['', [Validators.required]]
    });
  }

  buildErps(): FormGroup {
    return this.fb.group({
      baseUrl: ['', [Validators.required]],
      oauth2Url: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      grantType: ['', [Validators.required]],
      clientId: ['', [Validators.required]],
      scope: ['', [Validators.required]],
      saml: this.fb.group({
        oauth2Url: ['', [Validators.required]],
        grantType: ['', [Validators.required]],
        clientSecret: ['', [Validators.required]],
        resource: ['', [Validators.required]],
        tokenUse: ['', [Validators.required]],
        tokenType: ['', [Validators.required]]
      })
    });
  }

  buildProtectedResources(): FormGroup {
    return this.fb.group({
      identityMetadata: ['', [Validators.required]],
      issuer: ['', [Validators.required]],
      clientId: ['', [Validators.required]],
      audience: ['', [Validators.required]],
      scope: ['', [Validators.required]],
      urls: this.fb.array([], [Validators.required])
    });
  }
}
