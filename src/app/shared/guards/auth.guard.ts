import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { LoginService } from 'src/app/components/login/services/login.service';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private loginService: LoginService,
    private commonService: CommonService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.loginService.isUserAuthenticatedObservable$().pipe(
      mergeMap((isAuthenticated) => {
        if (isAuthenticated) {
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
                  sessionStorage.setItem(
                    'returnUrl',
                    `access-denied?url=${state.url}`
                  );
                  return false;
                }
              }
              return true;
            })
          );
        }
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: state.url }
        });
        return of(false);
      })
    );
  }
}
