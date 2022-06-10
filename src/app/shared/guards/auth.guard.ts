import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private router: Router,
    private commonService: CommonService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.oidcSecurityService.checkAuthMultiple().pipe(
      map((loginResponses) => {
        const authResponse = loginResponses.find(
          (loginResponse) => loginResponse.isAuthenticated === true
        );
        if (authResponse) {
          const { configId, userData } = authResponse;
          const configIds = loginResponses
            .map(({ isAuthenticated, configId: id }) =>
              isAuthenticated === false ? id : undefined
            )
            .filter((id) => id);

          this.commonService.performPostLoginActions(
            { configId, userData },
            configIds
          );
          return true;
        } else {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: state.url }
          });
          return false;
        }
      })
    );
  }
}
