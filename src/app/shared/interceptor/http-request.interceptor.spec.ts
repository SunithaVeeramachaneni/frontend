import { TestBed } from '@angular/core/testing';
import { OidcSecurityService } from 'angular-auth-oidc-client';

import { HttpRequestInterceptor } from './http-request.interceptor';

describe('RequestInterceptorService', () => {
  let service: HttpRequestInterceptor;
  let oidcSecurityServiceSpy: OidcSecurityService;

  beforeEach(() => {
    oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', ['getConfiguration']);

    TestBed.configureTestingModule({
      providers: [
        { provide: OidcSecurityService, useValue: oidcSecurityServiceSpy }
      ]
    });

    service = TestBed.inject(HttpRequestInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
