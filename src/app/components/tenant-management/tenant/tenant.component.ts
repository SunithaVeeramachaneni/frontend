import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { routingUrls } from 'src/app/app.constants';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantComponent implements OnInit {
  readonly routingUrls = routingUrls;

  public firstButton = true;
  public lastButton = false;
  public selectedID = new FormControl(0);
  public noOfTabs = 5;
  tenantForm: FormGroup;

  constructor(private fb: FormBuilder, private commonService: CommonService) {}

  ngOnInit(): void {
    this.tenantForm = this.fb.group({
      tenantId: ['', [Validators.required, Validators.maxLength(100)]],
      tenantName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],
      tenantIdp: ['', [Validators.required]],
      clientId: ['', [Validators.required, Validators.maxLength(100)]],
      authority: ['', [Validators.required, Validators.maxLength(255)]],
      redirectUri: ['', [Validators.required, Validators.maxLength(100)]],
      tenantDomainName: ['', [Validators.required, Validators.maxLength(100)]],
      tenantAdmin: this.fb.group({
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100)
          ]
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100)
          ]
        ],
        title: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100)
          ]
        ],
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
        host: ['', [Validators.required, Validators.maxLength(100)]],
        port: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
        user: ['', [Validators.required, Validators.maxLength(100)]],
        password: ['', [Validators.required, Validators.maxLength(100)]],
        database: ['', [Validators.required, Validators.maxLength(100)]],
        dialect: ['', [Validators.required]]
      }),
      nosql: this.fb.group({
        host: ['', [Validators.required, Validators.maxLength(100)]],
        port: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
        user: ['', [Validators.required, Validators.maxLength(100)]],
        password: ['', [Validators.required, Validators.maxLength(100)]],
        database: ['', [Validators.required, Validators.maxLength(100)]]
      }),
      licenseInfo: this.fb.group({
        start: ['', [Validators.required]],
        end: ['', [Validators.required]],
        count: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
      }),
      products: [[], [Validators.required]],
      modules: [[], [Validators.required]],
      logDBType: ['', [Validators.required]],
      logLevel: ['', [Validators.required]]
    });

    this.commonService.setHeaderTitle(
      this.tenantForm.get('tenantName').value
        ? this.tenantForm.get('tenantName').value
        : `Addding Tenant...`
    );
  }

  buildErps(): FormGroup {
    return this.fb.group({
      baseUrl: ['', [Validators.required, Validators.maxLength(255)]],
      oauth2Url: ['', [Validators.required, Validators.maxLength(255)]],
      username: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.maxLength(100)]],
      grantType: ['', [Validators.required, Validators.maxLength(100)]],
      clientId: ['', [Validators.required, Validators.maxLength(100)]],
      scope: ['', [Validators.required, Validators.maxLength(100)]],
      saml: this.fb.group({
        oauth2Url: ['', [Validators.required, Validators.maxLength(255)]],
        grantType: ['', [Validators.required, Validators.maxLength(100)]],
        clientSecret: ['', [Validators.required, Validators.maxLength(100)]],
        resource: ['', [Validators.required, Validators.maxLength(100)]],
        tokenUse: ['', [Validators.required, Validators.maxLength(100)]],
        tokenType: ['', [Validators.required, Validators.maxLength(100)]]
      })
    });
  }

  buildProtectedResources(): FormGroup {
    return this.fb.group({
      identityMetadata: ['', [Validators.required, Validators.maxLength(255)]],
      issuer: ['', [Validators.required, Validators.maxLength(100)]],
      clientId: ['', [Validators.required, Validators.maxLength(100)]],
      audience: ['', [Validators.required, Validators.maxLength(100)]],
      scope: ['', [Validators.required, Validators.maxLength(100)]],
      urls: this.fb.array([], [Validators.required, Validators.maxLength(100)])
    });
  }

  buttonActionsInHeader(noOfSteps) {
    this.selectedID.setValue(0);
    if (this.selectedID.value === 0) {
      this.firstButton = true;
    } else {
      this.firstButton = false;
    }

    if (this.selectedID.value === noOfSteps - 1) {
      this.lastButton = true;
    } else {
      this.lastButton = false;
    }
  }

  buttonActionsInSteps(index, noOfSteps) {
    this.selectedID.setValue(index);
    if (this.selectedID.value === 0) {
      this.firstButton = true;
    } else {
      this.firstButton = false;
    }

    if (this.selectedID.value === noOfSteps - 1) {
      this.lastButton = true;
    } else {
      this.lastButton = false;
    }
  }

  onTabsChange(index: number, noOfSteps) {
    if (this.selectedID.value === 0) {
      this.firstButton = true;
    } else {
      this.firstButton = false;
    }

    if (this.selectedID.value === noOfSteps - 1) {
      this.lastButton = true;
    } else {
      this.lastButton = false;
    }
  }

  moveNext(selectedID) {
    this.selectedID.setValue(selectedID.value + 1);
  }

  get f() {
    return this.tenantForm.controls;
  }
}
