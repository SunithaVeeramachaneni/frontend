import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AppMaterialModules } from '../../../material.module';
import { OverlayService } from '../../modal/overlay.service';
import { UserRegistrationComponent } from '../../modal/templates/user-registration/user-registration.component';
import { UserAccountService } from '../user-account.service';

import { LoginComponent } from './login.component';

const userDetails = [
  {
    "id": 57,
    "first_name": "Tester",
    "last_name": "One",
    "email": "tester.one@innovapptive.com",
    "password": "1000111tes",
    "role": "user",
    "empId": "1000111"
  }
];

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let overlayServiceSpy: OverlayService;
  let userAccServiceSpy: UserAccountService;
  let activatedRouteSpy: ActivatedRoute;
  let router: Router;
  let loginDe: DebugElement;
  let loginEl: HTMLElement;

  beforeEach(async(() => {
    overlayServiceSpy = jasmine.createSpyObj('OverlayService', ['open']);
    userAccServiceSpy = jasmine.createSpyObj('UserAccountService', ['login']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {queryParams: {}}
    });

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        AppMaterialModules,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: OverlayService, useValue: overlayServiceSpy },
        { provide: UserAccountService, useValue: userAccServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    loginDe = fixture.debugElement;
    loginEl = loginDe.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define variables & set defaults', () => {
    expect(component.submitted).toBeDefined();
    expect(component.submitted).toBe(false);
    expect(component.returnUrl).toBeDefined();
    expect(component.loginFormGroup).toBeDefined();
    expect(component.userRegSubscriptionComponent).toBeDefined();
    expect(typeof component.userRegSubscriptionComponent).toBe(
      typeof UserRegistrationComponent
    );
    expect(component.passwordhide).toBeDefined();
    expect(component.passwordhide).toBeTrue();
    expect(component.passwordhide).toBeDefined();
    expect(component.userValidatedMsg).toBeDefined();
    expect(component.userValidatedMsg).toBe('');
    expect(component.userRegDetailObject).toBeDefined();
    expect(component.userRegDetailObject).toEqual({});
  });

  describe('template', () => {
    it('should contain labels related to login', () => {
      expect(loginEl.querySelector('.row img').getAttribute('src')).toContain('Innovapptive.png');
      const cardImages = loginEl.querySelectorAll('.card img');
      expect(cardImages.length).toBe(2);
      expect(cardImages[0].getAttribute('src')).toContain('cwp.png');
      expect(cardImages[1].getAttribute('src')).toContain('Arrow.png');
      expect(loginEl.querySelector('.card h4').textContent).toBe('Connected Worker Platform');
      const form = loginEl.querySelector('form');
      expect(form.textContent).toContain('Email');
      expect(form.textContent).toContain('Password');
      expect(form.textContent).toContain('Remember Me');
      expect(form.textContent).toContain('LOGIN');
      expect(loginEl.querySelectorAll('form input').length).toBe(3);
      expect(loginEl.querySelectorAll('form mat-label').length).toBe(2);
      expect(loginEl.querySelectorAll('form mat-form-field').length).toBe(2);
      expect(loginEl.querySelectorAll('form button').length).toBe(2);
      expect(loginEl.querySelectorAll('.card button').length).toBe(3);
      expect(loginEl.querySelector('.card').textContent).toContain('Register New User');
    });

    it('should display password on password visibility button click', () => {
      (loginEl.querySelectorAll('form button')[0] as HTMLElement).click();
      expect(component.passwordhide).toBeFalse();
    });

    it('should hide password on password visibility button click', () => {
      component.passwordhide = false;
      (loginEl.querySelectorAll('form button')[0] as HTMLElement).click();
      expect(component.passwordhide).toBeTrue();
    });
  });

  describe('form validation messages', () => {
    it('should display email & password required if both are empty', () => {
      (loginEl.querySelector('.login-button') as HTMLElement).click();
      fixture.detectChanges();
      expect(component.f.email.errors.required).toBeTrue();
      expect(component.f.password.errors.required).toBeTrue();
      const matErrors = loginEl.querySelectorAll('mat-error');
      expect(matErrors.length).toBe(2);
      expect(matErrors[0].textContent).toBe('Email is required');
      expect(matErrors[1].textContent).toBe('Password required');
    });

    it('should display email required if email is empty', () => {
      const email = '';
      const password = '1000111tes';
      const inputs = loginEl.querySelectorAll('input');
      inputs[0].value = email;
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = password;
      inputs[1].dispatchEvent(new Event('input'));
      (loginEl.querySelector('.login-button') as HTMLElement).click();
      fixture.detectChanges();
      expect(component.f.email.errors.required).toBeTrue();
      expect(component.f.password.errors).toBeNull();
      const matErrors = loginEl.querySelectorAll('mat-error');
      expect(matErrors.length).toBe(1);
      expect(matErrors[0].textContent).toBe('Email is required');
    });

    it('should display email is invalid if email is not valid', () => {
      const email = 'tester.one';
      const password = '1000111tes';
      const inputs = loginEl.querySelectorAll('input');
      inputs[0].value = email;
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = password;
      inputs[1].dispatchEvent(new Event('input'));
      (loginEl.querySelector('.login-button') as HTMLElement).click();
      fixture.detectChanges();
      expect(component.f.email.errors.email).toBeTrue();
      expect(component.f.password.errors).toBeNull();
      const matErrors = loginEl.querySelectorAll('mat-error');
      expect(matErrors.length).toBe(1);
      expect(matErrors[0].textContent).toBe('Email is invalid');
    });

    it('should display password required if password is empty', () => {
      const email = 'tester.one@innovapptive.com';
      const password = '';
      const inputs = loginEl.querySelectorAll('input');
      inputs[0].value = email;
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = password;
      inputs[1].dispatchEvent(new Event('input'));
      (loginEl.querySelector('.login-button') as HTMLElement).click();
      fixture.detectChanges();
      expect(component.f.email.errors).toBeNull();
      expect(component.f.password.errors.required).toBeTrue();
      const matErrors = loginEl.querySelectorAll('mat-error');
      expect(matErrors.length).toBe(1);
      expect(matErrors[0].textContent).toBe('Password required');
    });

    it('should display password length validation if password not match criteria', () => {
      const email = 'tester.one@innovapptive.com';
      const password = 'test';
      const inputs = loginEl.querySelectorAll('input');
      inputs[0].value = email;
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = password;
      inputs[1].dispatchEvent(new Event('input'));
      (loginEl.querySelector('.login-button') as HTMLElement).click();
      fixture.detectChanges();
      expect(component.f.email.errors).toBeNull();
      expect(component.f.password.errors.minlength).toEqual({
        requiredLength: 8,
        actualLength: 4
      });
      const matErrors = loginEl.querySelectorAll('mat-error');
      expect(matErrors.length).toBe(1);
      expect(matErrors[0].textContent).toBe('Password should not be less than 8 characters');
    });
  });


  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should set default form values for login form', () => {
      component.ngOnInit();
      expect(component.f.email.value).toBe('');
      expect(component.f.password.value).toBe('');
      expect(component.returnUrl).toBe('/home');
      expect(component.loginFormGroup.valid).toBeFalse();
    });

    it('should set returnUrl from router snapshop if returnUrl present in query string', () => {
      (Object.getOwnPropertyDescriptor(activatedRouteSpy, 'snapshot')
        .get as jasmine.Spy).and.returnValue({queryParams: {returnUrl: '/drafts'}});
      component.ngOnInit();
      expect(component.returnUrl).toBe('/drafts');
    });
  });

  describe('f', () => {
    it('should define variable', () => {
      expect(component.f).toBeDefined();
    });

    it('should has form controls', () => {
      expect(component.f.email).toBeDefined();
      expect(component.f.password).toBeDefined();
    });
  });

  describe('checkError', () => {
    it('should define function', () => {
      expect(component.checkError).toBeDefined();
    });

    it('should return true if field has error', () => {
      const email = '';
      const password = '1000111tes';
      const inputs = loginEl.querySelectorAll('input');
      inputs[0].value = email;
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = password;
      inputs[1].dispatchEvent(new Event('input'));
      (loginEl.querySelector('.login-button') as HTMLElement).click();
      fixture.detectChanges();
      const response = component.checkError('email', 'required');
      expect(response).toBeTrue();
    });
  });

  describe('onSubmit', () => {
    it('should define function', () => {
      expect(component.onSubmit).toBeDefined();
    });

    it('should not submit the form if form is invalid', () => {
      (loginEl.querySelector('.login-button') as HTMLElement).click();
      fixture.detectChanges();
      expect(component.submitted).toBeTrue();
      expect(userAccServiceSpy.login).not.toHaveBeenCalled();
      expect(component.loginFormGroup.invalid).toBeTrue();
      expect(component.f.email.errors.required).toBeTrue();
      expect(component.f.password.errors.required).toBeTrue();
      const matErrors = loginEl.querySelectorAll('mat-error');
      expect(matErrors.length).toBe(2);
      expect(matErrors[0].textContent).toBe('Email is required');
      expect(matErrors[1].textContent).toBe('Password required');
    });

    it('should submit the form if form is valid', () => {
      const email = 'tester.one@innovapptive.com';
      const password = '1000111tes';
      (userAccServiceSpy.login as jasmine.Spy)
        .withArgs(email, password)
        .and.returnValue(of(userDetails))
        .and.callThrough();
      spyOn(router, 'navigate');
      const userDetailsCopy = [{...userDetails[0]}];
      userDetailsCopy[0].password = btoa(password);
      const inputs = loginEl.querySelectorAll('input');
      inputs[0].value = email;
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = password;
      inputs[1].dispatchEvent(new Event('input'));
      (loginEl.querySelector('.login-button') as HTMLElement).click();
      fixture.detectChanges();
      expect(component.submitted).toBeTrue();
      expect(component.loginFormGroup.valid).toBeTrue();
      expect(component.loginFormGroup.invalid).toBeFalse();
      expect(component.f.email.errors).toBeNull();
      const matErrors = loginEl.querySelectorAll('mat-error');
      expect(matErrors.length).toBe(0);
      expect(userAccServiceSpy.login).toHaveBeenCalledWith(email, password);
      expect(userAccServiceSpy.login).toHaveBeenCalledTimes(1);
      expect(JSON.parse(localStorage.getItem('loggedInUser'))).toEqual(userDetailsCopy[0]);
      expect(router.navigate).toHaveBeenCalledWith([component.returnUrl]);
    });

    it('should submit the form if form is valid and display Invalid Password incase of wrong password', () => {
      const email = 'tester.one@innovapptive.com';
      const password = '1000111tester';
      (userAccServiceSpy.login as jasmine.Spy)
        .withArgs(email, password)
        .and.returnValue(of(userDetails))
        .and.callThrough();
      spyOn(router, 'navigate');
      const userDetailsCopy = [{...userDetails[0]}];
      userDetailsCopy[0].password = btoa(password);
      const inputs = loginEl.querySelectorAll('input');
      inputs[0].value = email;
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = password;
      inputs[1].dispatchEvent(new Event('input'));
      (loginEl.querySelector('.login-button') as HTMLElement).click();
      fixture.detectChanges();
      expect(component.submitted).toBeTrue();
      expect(component.loginFormGroup.valid).toBeTrue();
      expect(component.loginFormGroup.invalid).toBeFalse();
      expect(component.f.email.errors).toBeNull();
      const matErrors = loginEl.querySelectorAll('mat-error');
      expect(matErrors.length).toBe(0);
      expect(userAccServiceSpy.login).toHaveBeenCalledWith(email, password);
      expect(userAccServiceSpy.login).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem('loggedInUser')).toBeNull();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(component.userValidatedMsg).toBe('Invalid Password!');
      expect(loginEl.querySelector('.mat-error').textContent).toBe('Invalid Password!');
    });

    it('should submit the form if form is valid and display Invalid Email or Password incase of wrong email or password', () => {
      const email = 'tester1.one@innovapptive.com';
      const password = '1000111tester';
      (userAccServiceSpy.login as jasmine.Spy)
        .withArgs(email, password)
        .and.returnValue(of([]))
        .and.callThrough();
      spyOn(router, 'navigate');
      const userDetailsCopy = [{...userDetails[0]}];
      userDetailsCopy[0].password = btoa(password);
      const inputs = loginEl.querySelectorAll('input');
      inputs[0].value = email;
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = password;
      inputs[1].dispatchEvent(new Event('input'));
      (loginEl.querySelector('.login-button') as HTMLElement).click();
      fixture.detectChanges();
      expect(component.submitted).toBeTrue();
      expect(component.loginFormGroup.valid).toBeTrue();
      expect(component.loginFormGroup.invalid).toBeFalse();
      expect(component.f.email.errors).toBeNull();
      const matErrors = loginEl.querySelectorAll('mat-error');
      expect(matErrors.length).toBe(0);
      expect(userAccServiceSpy.login).toHaveBeenCalledWith(email, password);
      expect(userAccServiceSpy.login).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem('loggedInUser')).toBeNull();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(component.userValidatedMsg).toBe('Invalid Email or Password!');
      expect(loginEl.querySelector('.mat-error').textContent).toBe('Invalid Email or Password!');
    });

    it('should handle error while submitting the form', () => {
      const email = 'tester.one@innovapptive.com';
      const password = '1000111tes';
      (userAccServiceSpy.login as jasmine.Spy)
        .withArgs(email, password)
        .and.returnValue(throwError('Error with login service'))
        .and.callThrough();
      spyOn(router, 'navigate');
      const userDetailsCopy = [{...userDetails[0]}];
      userDetailsCopy[0].password = btoa(password);
      const inputs = loginEl.querySelectorAll('input');
      inputs[0].value = email;
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = password;
      inputs[1].dispatchEvent(new Event('input'));
      (loginEl.querySelector('.login-button') as HTMLElement).click();
      fixture.detectChanges();
      expect(component.submitted).toBeTrue();
      expect(component.loginFormGroup.valid).toBeTrue();
      expect(component.loginFormGroup.invalid).toBeFalse();
      expect(component.f.email.errors).toBeNull();
      const matErrors = loginEl.querySelectorAll('mat-error');
      expect(matErrors.length).toBe(0);
      expect(userAccServiceSpy.login).toHaveBeenCalledWith(email, password);
      expect(userAccServiceSpy.login).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem('loggedInUser')).toBeNull();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(component.userValidatedMsg).toBe('');
      expect(loginEl.querySelector('.mat-error').textContent).toBe('');
    });
  });

  describe('open', () => {
    it('should define function', () => {
      expect(component.open).toBeDefined();
    });

    it('should register new user', () => {
      const userRegSubscriptionComponent = UserRegistrationComponent;
      const data = {
        empId: 1000112,
        email: 'tester.two@innovapptive.com',
        firstname: 'tester',
        lastname: 'two'
      };
      const { empId, email, firstname: first_name, lastname: last_name } = data;
      const user = {
        empId,
        email,
        first_name,
        last_name,
        department: 'PSO',
        status: 'none'
      };
      (overlayServiceSpy.open as jasmine.Spy).and.returnValue({
        afterClosed$: of({ data }),
      });
      loginEl.querySelector('a').click();
      expect(overlayServiceSpy.open).toHaveBeenCalledWith(userRegSubscriptionComponent, {});
      expect(overlayServiceSpy.open).toHaveBeenCalledTimes(1);
      expect(component.userRegDetailObject).toEqual(data);
    });

    it('should not register new user if data is null', () => {
      const userRegSubscriptionComponent = UserRegistrationComponent;
      const data = null;
      (overlayServiceSpy.open as jasmine.Spy).and.returnValue({
        afterClosed$: of({ data }),
      });
      loginEl.querySelector('a').click();
      expect(overlayServiceSpy.open).toHaveBeenCalledWith(userRegSubscriptionComponent, {});
      expect(overlayServiceSpy.open).toHaveBeenCalledTimes(1);
      expect(component.userRegDetailObject).toBeNull();
    });
  });

});
