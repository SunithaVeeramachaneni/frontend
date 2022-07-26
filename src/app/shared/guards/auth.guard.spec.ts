import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { permissions } from 'src/app/app.constants';
import { LoginService } from 'src/app/components/login/services/login.service';
import { userInfo$ } from 'src/app/components/login/services/login.service.mock';

import { AuthGuard } from './auth.guard';
import { loginResponses, loginResponses$ } from './auth.guard.mock';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let oidcSecurityServiceSpy: OidcSecurityService;
  let loginServiceSpy: LoginService;
  let routerStateSnapshotSpy: RouterStateSnapshot;
  let router: Router;

  beforeEach(() => {
    oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', [
      'checkAuthMultiple'
    ]);
    loginServiceSpy = jasmine.createSpyObj(
      'LoginService',
      ['performPostLoginActions'],
      {
        loggedInUserInfo$: userInfo$
      }
    );
    routerStateSnapshotSpy = jasmine.createSpyObj('RouterStateSnapshot', [], {
      snapshot: {},
      url: '/home'
    });

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: OidcSecurityService,
          useValue: oidcSecurityServiceSpy
        },
        {
          provide: LoginService,
          useValue: loginServiceSpy
        },
        {
          provide: RouterStateSnapshot,
          useValue: routerStateSnapshotSpy
        }
      ]
    });
    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return observable of true, if user is authenticated', () => {
    const { configId, userData } = loginResponses[0];
    (oidcSecurityServiceSpy.checkAuthMultiple as jasmine.Spy)
      .withArgs()
      .and.returnValue(loginResponses$);
    const route = new ActivatedRouteSnapshot();
    route.data = { permissions: [permissions.viewDashboards] };

    guard.canActivate(route, routerStateSnapshotSpy).subscribe((response) => {
      expect(response).toBe(true);
      expect(loginServiceSpy.performPostLoginActions).toHaveBeenCalledWith(
        {
          configId,
          userData
        },
        [loginResponses[1].configId, loginResponses[2].configId]
      );
    });
  });

  it('should return observable of false, if user is not authenticated', () => {
    const navigateSpy = spyOn(router, 'navigate');
    (oidcSecurityServiceSpy.checkAuthMultiple as jasmine.Spy)
      .withArgs()
      .and.returnValue(of([loginResponses[1], loginResponses[2]]));

    guard
      .canActivate(new ActivatedRouteSnapshot(), routerStateSnapshotSpy)
      .subscribe((response) => {
        expect(response).toBe(false);
        expect(navigateSpy).toHaveBeenCalledWith(['/login'], {
          queryParams: { returnUrl: '/home' }
        });
      });
  });
});
