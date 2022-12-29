/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth, Hub } from 'aws-amplify';
import { EMPTY, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Tenant } from 'src/app/interfaces';
import { TenantService } from '../../tenant-management/services/tenant.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  tenantInfo: Tenant;
  providerName: string;
  displaySignIn: boolean;
  returnUrl: string;

  constructor(
    private tenantService: TenantService,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setReturnUrl();
    this.tenantService.tenantInfo$.subscribe((tenantInfo) => {
      this.tenantInfo = tenantInfo;
      this.providerName = tenantInfo.tenantIdp;
    });
    this.loginService
      .loggedInUserSession$()
      .pipe(
        tap(() => {
          this.displaySignIn = false;
          this.loginService.setUserAuthenticated(true);
          this.router.navigate(['home']);
        }),
        catchError((error) => {
          // Uncomment below code for automatic redirection to tenant
          /* if (error === 'No current user') {
            Auth.federatedSignIn({
              customProvider: this.tenantInfo.tenantIdp
            });
          } */
          this.displaySignIn = true;
          return of(EMPTY);
        })
      )
      .subscribe();

    Hub.listen('auth', (data) => {
      switch (data.payload.event) {
        case 'signIn':
          this.displaySignIn = false;
          break;
        case 'signUp':
          // TODO : SignUp event logic goes here...
          break;
        case 'signOut':
          this.loginService.setUserAuthenticated(false);
          break;
        case 'signIn_failure':
          // TODO : SignUp failure event logic goes here...
          break;
        case 'configured':
          // TODO : Auth configuration event logic goes here...
          break;
        default:
        // Do nothing
      }
    });
  }

  setReturnUrl() {
    if (sessionStorage.getItem('returnUrl') === null) {
      sessionStorage.setItem(
        'returnUrl',
        this.route.snapshot.queryParams.returnUrl
      );
    }
  }

  singleSignOn() {
    Auth.federatedSignIn({
      customProvider: this.tenantInfo.tenantIdp
    });
  }
}
