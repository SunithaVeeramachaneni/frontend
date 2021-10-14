import { Component, OnInit } from '@angular/core';
import { AuthModule, OidcSecurityService, UserDataResult } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';
import { IdpConfig } from "../../interfaces/idpconfig";
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public email="";
  userData$: Observable<UserDataResult>;
  isAuthenticated = false;
  public idpConfig$: Observable<IdpConfig>

  constructor(public oidcSecurityService: OidcSecurityService,
    private _loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,) { }

  ngOnInit() {
    this.oidcSecurityService.isAuthenticated$.subscribe(({ isAuthenticated }) => {
      this.isAuthenticated = isAuthenticated;
      console.warn('authenticated: ', isAuthenticated);
    });
    this.userData$ = this.oidcSecurityService.userData$;
  }

  login(){
    alert(this.email);
    this.idpConfig$ =this._loginService.getIdpConfig(this.email);
    this.idpConfig$.subscribe(res=>{
      console.log("idpcpnfig",res)
      // AuthModule.forRoot({config:res});
      this.router.navigate(['/maintenance']);

    })
  }

}
