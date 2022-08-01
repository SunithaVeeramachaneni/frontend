import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { LoginService } from 'src/app/components/login/services/login.service';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private router: Router,
    private loginService: LoginService,
    private commonService: CommonService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Checking user is authenticated or not
    return this.oidcSecurityService.checkAuthMultiple().pipe(
      mergeMap((loginResponses) => {
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
          // Checking user is having permission to access the route
          this.commonService.setDisplayLoader(true);
          return this.loginService.loggedInUserInfo$.pipe(
            filter(
              (userInfo) => userInfo && Object.keys(userInfo).length !== 0
            ),
            map(({ permissions }) => {
              this.commonService.setDisplayLoader(false);
              if (route.data.permissions) {
                const exists = permissions.find((permission) =>
                  route.data.permissions.includes(permission.name)
                );
                if (!exists) {
                  this.router.navigate(['access-denied'], {
                    queryParams: { url: state.url }
                  });
                  return false;
                }
              }
              this.loginService.performPostLoginActions(
                { configId, userData },
                configIds
              );
              return true;
            })
          );
        } else {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: state.url }
          });
          return of(false);
        }
      })
    );
  }
}
