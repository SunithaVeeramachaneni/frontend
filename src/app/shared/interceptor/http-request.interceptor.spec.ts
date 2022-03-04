import { TestBed } from '@angular/core/testing';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AppService } from '../services/app.services';
import { CommonService } from '../services/common.service';

import { HttpRequestInterceptor } from './http-request.interceptor';

describe('RequestInterceptorService', () => {
  let service: HttpRequestInterceptor;
  let oidcSecurityServiceSpy: OidcSecurityService;
  let appServiceSpy: AppService;
  let commonServiceSpy: CommonService;

  beforeEach(() => {
    oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', ['getConfiguration']);
    appServiceSpy = jasmine.createSpyObj('AppService', ['postRefreshToken']);
    commonServiceSpy = jasmine.createSpyObj('CommonService', ['getProtectedResources']);

    TestBed.configureTestingModule({
      providers: [
        { provide: OidcSecurityService, useValue: oidcSecurityServiceSpy },
        { provide: AppService, useValue: appServiceSpy },
        { provide: CommonService, useValue: commonServiceSpy }
      ]
    });

    service = TestBed.inject(HttpRequestInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
