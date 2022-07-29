import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { LoginService } from '../components/login/services/login.service';
import {
  permissions,
  userInfo$
} from '../components/login/services/login.service.mock';
import { HeaderService } from '../shared/services/header.service';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let headerServiceSpy: HeaderService;
  let loginServiceSpy: LoginService;
  let router: Router;
  let navigateSpy;

  beforeEach(async () => {
    headerServiceSpy = jasmine.createSpyObj('HeaderService', [
      'setHeaderTitle'
    ]);
    loginServiceSpy = jasmine.createSpyObj('LoginService', [], {
      loggedInUserInfo$: userInfo$
    });

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule, NgxShimmerLoadingModule],
      providers: [
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: HeaderService, useValue: headerServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    navigateSpy = spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should navigate to return url, If return url present in session storage', () => {
      sessionStorage.setItem('returnUrl', '/work-instructions');

      component.ngOnInit();

      expect(navigateSpy).toHaveBeenCalledWith(['/work-instructions']);
      expect(sessionStorage.getItem('returnUrl')).toBe(null);
    });

    it('should call navigateToModule, If return url is home or access-denied', () => {
      sessionStorage.setItem('returnUrl', '/home');
      spyOn(component, 'navigateToModule');

      component.ngOnInit();

      expect(component.navigateToModule).toHaveBeenCalledWith();

      sessionStorage.setItem('returnUrl', '/access-denied');

      component.ngOnInit();

      expect(component.navigateToModule).toHaveBeenCalledWith();
    });
  });

  describe('navigateToModule', () => {
    it('should define function', () => {
      expect(component.navigateToModule).toBeDefined();
    });

    it('should navigate based on permissions available', () => {
      component.permissions = permissions;

      component.navigateToModule();

      expect(headerServiceSpy.setHeaderTitle).toHaveBeenCalledWith('Dashboard');
      expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
    });
  });
});
