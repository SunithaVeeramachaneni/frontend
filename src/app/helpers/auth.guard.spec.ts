import { async, TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from '.';

describe('AuthGuard', () => {
  let service: AuthGuard;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: []
    });
    service = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  }));

  afterEach(() => {
    localStorage.clear();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should define function', () => {
      expect(service.canActivate).toBeDefined();
    });

    it('should return true if user is logged in', () => {
      const response = {
        "data": [
          {
            "id": 57,
            "first_name": "tester",
            "last_name": "one",
            "email": "tester.one@innovapptive.com",
            "password": "1000111tes",
            "role": "user",
            "empId": "1000111"
          }
        ]
      };
      localStorage.setItem('loggedInUser', JSON.stringify(response.data[0]));
      const result = service.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{url: '/drafts'});
      expect(result).toBeTrue();
    });

    it('should return false and navigate to sigin', () => {
      spyOn(router, 'navigate');
      const result = service.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{url: '/drafts'});
      expect(router.navigate).toHaveBeenCalledWith(['/signin'], { queryParams: { returnUrl: '/drafts' }});
      expect(result).toBeFalse();
    });
  });
});
