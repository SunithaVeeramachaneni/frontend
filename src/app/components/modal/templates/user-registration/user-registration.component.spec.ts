import { HttpErrorResponse } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { ErrorInfo } from '../../../../interfaces/error-info';
import { AppMaterialModules } from '../../../../material.module';
import { InstructionService } from '../../../workInstructions-home/categories/workinstructions/instruction.service';
import { UserAccountService } from '../../../user-management/user-account.service';
import { AlertComponent } from '../../alert/alert.component';
import { AlertService } from '../../alert/alert.service';
import { MyOverlayRef } from '../../myoverlay-ref';
import { UserRegistrationComponent } from './user-registration.component';

const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };

describe('UserRegistrationComponent', () => {
  let component: UserRegistrationComponent;
  let fixture: ComponentFixture<UserRegistrationComponent>;
  let myOverlayRefSpy: MyOverlayRef;
  let instructionServiceSpy: InstructionService;
  let alertServiceSpy: AlertService;
  let userAccServiceSpy: UserAccountService;
  let registrationDe: DebugElement;
  let registrationEl: HTMLElement;

  beforeEach(async(() => {
    myOverlayRefSpy = jasmine.createSpyObj('MyOverlayRef', ['close']);
    instructionServiceSpy = jasmine.createSpyObj('InstructionService', ['getUsersByEmail', 'getErrorMessage']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', [
      'clear',
      'error',
      'success',
    ]);
    userAccServiceSpy = jasmine.createSpyObj('UserAccountService', [
      'register',
      'sendApproveMail',
    ]);
    TestBed.configureTestingModule({
      declarations: [UserRegistrationComponent, MockComponent(AlertComponent)],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        AppMaterialModules,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MyOverlayRef, useValue: myOverlayRefSpy },
        { provide: InstructionService, useValue: instructionServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: UserAccountService, useValue: userAccServiceSpy },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRegistrationComponent);
    component = fixture.componentInstance;
    registrationDe = fixture.debugElement;
    registrationEl = registrationDe.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define variables & set defaults', () => {
    expect(component.submitted).toBeDefined();
    expect(component.submitted).toBeFalse();
    expect(component.userValidatedMsg).toBeDefined();
    expect(component.registerFormGroup).toBeDefined();
  });

  describe('template', () => {
    it('should contain labels related user registration', () => {
      expect(registrationEl.querySelectorAll('form').length).toBe(1);
      expect(registrationEl.querySelectorAll('form input').length).toBe(4);
      expect(registrationEl.querySelectorAll('form button').length).toBe(2);
      expect(registrationEl.querySelectorAll('form mat-label').length).toBe(4);
      expect(registrationEl.querySelectorAll('form mat-form-field').length).toBe(4);
      expect(registrationEl.querySelector('.modal-card-head').textContent).toContain('New User');
      expect(registrationEl.querySelectorAll('app-alert').length).toBe(1);
      const matLabels = registrationEl.querySelectorAll('form mat-label');
      expect(matLabels[0].textContent).toBe('Employee ID');
      expect(matLabels[1].textContent).toBe('Email');
      expect(matLabels[2].textContent).toBe('First Name');
      expect(matLabels[3].textContent).toBe('Last Name');
      const footerBtns = registrationEl.querySelectorAll('.modal-card-foot button');
      expect(footerBtns.length).toBe(2);
      expect(footerBtns[0].textContent).toBe('CANCEL');
      expect(footerBtns[1].textContent).toBe('REGISTER');
    });
  });

  describe('form validation messages', () => {
    it('should display all fields are required if all fileds are empty', () => {
      const buttons = registrationEl.querySelectorAll('button');
      buttons[buttons.length - 1].click();
      fixture.detectChanges();
      expect(component.f.empId.errors.required).toBeTrue();
      expect(component.f.email.errors.required).toBeTrue();
      expect(component.f.firstname.errors.required).toBeTrue();
      expect(component.f.lastname.errors.required).toBeTrue();
      const matErrors = registrationEl.querySelectorAll('mat-error');
      expect(matErrors[0].textContent).toBe('Employee ID is required');
      expect(matErrors[1].textContent).toBe('Email is required');
      expect(matErrors[2].textContent).toBe('First Name is required');
      expect(matErrors[3].textContent).toBe('Last Name is required');
      expect(matErrors.length).toBe(4);
    });

    it('should display Employee Id is required if Employee Id is empty', () => {
      const empId = '';
      const email = 'tester.one@innovapptive.com';
      const firstname = 'tester';
      const lastname = 'one';
      const inputs = registrationEl.querySelectorAll('input');
      inputs[0].value = empId;
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = email;
      inputs[1].dispatchEvent(new Event('input'));
      inputs[2].value = firstname;
      inputs[2].dispatchEvent(new Event('input'));
      inputs[3].value = lastname;
      inputs[3].dispatchEvent(new Event('input'));
      const buttons = registrationEl.querySelectorAll('button');
      buttons[buttons.length - 1].click();
      fixture.detectChanges();
      expect(component.f.empId.errors.required).toBeTrue();
      expect(component.f.email.errors).toBeNull();
      expect(component.f.firstname.errors).toBeNull();
      expect(component.f.lastname.errors).toBeNull();
      const matErrors = registrationEl.querySelectorAll('mat-error');
      expect(matErrors[0].textContent).toBe('Employee ID is required');
      expect(matErrors.length).toBe(1);
    });

    it('should display email is required if email is empty', () => {
      const empId = '1000111';
      const email = '';
      const firstname = 'tester';
      const lastname = 'one';
      const inputs = registrationEl.querySelectorAll('input');
      inputs[0].value = empId;
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = email;
      inputs[1].dispatchEvent(new Event('input'));
      inputs[2].value = firstname;
      inputs[2].dispatchEvent(new Event('input'));
      inputs[3].value = lastname;
      inputs[3].dispatchEvent(new Event('input'));
      const buttons = registrationEl.querySelectorAll('button');
      buttons[buttons.length - 1].click();
      fixture.detectChanges();
      expect(component.f.empId.errors).toBeNull();
      expect(component.f.email.errors.required).toBeTrue();
      expect(component.f.firstname.errors).toBeNull();
      expect(component.f.lastname.errors).toBeNull();
      const matErrors = registrationEl.querySelectorAll('mat-error');
      expect(matErrors[0].textContent).toBe('Email is required');
      expect(matErrors.length).toBe(1);
    });

    it('should display Email format must be corrected incase of invalid email', () => {
      const empId = '1000111';
      const email = 'tester.one';
      const firstname = 'tester';
      const lastname = 'one';
      const inputs = registrationEl.querySelectorAll('input');
      inputs[0].value = empId;
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = email;
      inputs[1].dispatchEvent(new Event('input'));
      inputs[2].value = firstname;
      inputs[2].dispatchEvent(new Event('input'));
      inputs[3].value = lastname;
      inputs[3].dispatchEvent(new Event('input'));
      const buttons = registrationEl.querySelectorAll('button');
      buttons[buttons.length - 1].click();
      fixture.detectChanges();
      expect(component.f.empId.errors).toBeNull();
      expect(component.f.email.errors.email).toBeTrue();
      expect(component.f.firstname.errors).toBeNull();
      expect(component.f.lastname.errors).toBeNull();
      const matErrors = registrationEl.querySelectorAll('mat-error');
      expect(matErrors[0].textContent).toBe('Email format must be corrected');
      expect(matErrors.length).toBe(1);
    });

    it('should display first name is required if firstname is empty', () => {
      const empId = '1000111';
      const email = 'tester.one@innovapptive.com';
      const firstname = '';
      const lastname = 'one';
      const inputs = registrationEl.querySelectorAll('input');
      inputs[0].value = empId;
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = email;
      inputs[1].dispatchEvent(new Event('input'));
      inputs[2].value = firstname;
      inputs[2].dispatchEvent(new Event('input'));
      inputs[3].value = lastname;
      inputs[3].dispatchEvent(new Event('input'));
      const buttons = registrationEl.querySelectorAll('button');
      buttons[buttons.length - 1].click();
      fixture.detectChanges();
      expect(component.f.empId.errors).toBeNull();
      expect(component.f.email.errors).toBeNull();
      expect(component.f.firstname.errors.required).toBeTrue();
      expect(component.f.lastname.errors).toBeNull();
      const matErrors = registrationEl.querySelectorAll('mat-error');
      expect(matErrors[0].textContent).toBe('First Name is required');
      expect(matErrors.length).toBe(1);
    });

    it('should display minimum length validation message if firstname not meet the minlenth criteria', () => {
      const empId = '1000111';
      const email = 'tester.one@innovapptive.com';
      const firstname = 'te';
      const lastname = 'one';
      const inputs = registrationEl.querySelectorAll('input');
      inputs[0].value = empId;
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = email;
      inputs[1].dispatchEvent(new Event('input'));
      inputs[2].value = firstname;
      inputs[2].dispatchEvent(new Event('input'));
      inputs[3].value = lastname;
      inputs[3].dispatchEvent(new Event('input'));
      const buttons = registrationEl.querySelectorAll('button');
      buttons[buttons.length - 1].click();
      fixture.detectChanges();
      expect(component.f.empId.errors).toBeNull();
      expect(component.f.email.errors).toBeNull();
      expect(component.f.firstname.errors.minlength).toEqual({
        requiredLength: 3,
        actualLength: 2
      });
      expect(component.f.lastname.errors).toBeNull();
      const matErrors = registrationEl.querySelectorAll('mat-error');
      expect(matErrors[0].textContent).toBe('First Name must be minimum of 3 characters');
      expect(matErrors.length).toBe(1);
    });

    it('should display last name is required if lastname is empty', () => {
      const empId = '1000111';
      const email = 'tester.one@innovapptive.com';
      const firstname = 'tester';
      const lastname = '';
      const inputs = registrationEl.querySelectorAll('input');
      inputs[0].value = empId;
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = email;
      inputs[1].dispatchEvent(new Event('input'));
      inputs[2].value = firstname;
      inputs[2].dispatchEvent(new Event('input'));
      inputs[3].value = lastname;
      inputs[3].dispatchEvent(new Event('input'));
      const buttons = registrationEl.querySelectorAll('button');
      buttons[buttons.length - 1].click();
      fixture.detectChanges();
      expect(component.f.empId.errors).toBeNull();
      expect(component.f.email.errors).toBeNull();
      expect(component.f.firstname.errors).toBeNull();
      expect(component.f.lastname.errors.required).toBeTrue();
      const matErrors = registrationEl.querySelectorAll('mat-error');
      expect(matErrors[0].textContent).toBe('Last Name is required');
      expect(matErrors.length).toBe(1);
    });

    it('should display minimum length validation message if lastname not meet the minlenth criteria', () => {
      const empId = '1000111';
      const email = 'tester.one@innovapptive.com';
      const firstname = 'tester';
      const lastname = 'on';
      const inputs = registrationEl.querySelectorAll('input');
      inputs[0].value = empId;
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = email;
      inputs[1].dispatchEvent(new Event('input'));
      inputs[2].value = firstname;
      inputs[2].dispatchEvent(new Event('input'));
      inputs[3].value = lastname;
      inputs[3].dispatchEvent(new Event('input'));
      const buttons = registrationEl.querySelectorAll('button');
      buttons[buttons.length - 1].click();
      fixture.detectChanges();
      expect(component.f.empId.errors).toBeNull();
      expect(component.f.email.errors).toBeNull();
      expect(component.f.firstname.errors).toBeNull();
      expect(component.f.lastname.errors.minlength).toEqual({
        requiredLength: 3,
        actualLength: 2
      });
      const matErrors = registrationEl.querySelectorAll('mat-error');
      expect(matErrors[0].textContent).toBe('Last Name must be minimum of 3 characters');
      expect(matErrors.length).toBe(1);
    });
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should define form controls and set default form values', () => {
      component.ngOnInit();
      expect(component.f.empId.value).toBe('');
      expect(component.f.email.value).toBe('');
      expect(component.f.firstname.value).toBe('');
      expect(component.f.lastname.value).toBe('');
    });
  });

  describe('f', () => {
    it('should define variable', () => {
      expect(component.f).toBeDefined();
    });

    it('should has form controls', () => {
      expect(component.f.empId).toBeDefined();
      expect(component.f.email).toBeDefined();
      expect(component.f.firstname).toBeDefined();
      expect(component.f.lastname).toBeDefined();
    });
  });

  describe('checkError', () => {
    it('should define function', () => {
      expect(component.checkError).toBeDefined();
    });

    it('should return true if field has error', () => {
      const buttons = registrationEl.querySelectorAll('button');
      buttons[buttons.length - 1].click();
      fixture.detectChanges();
      expect(component.checkError('empId', 'required')).toBeTrue();
    });
  });

  describe('onRegistrationSubmit', () => {
    const empId = '1000111';
    const email = 'tester.one@innovapptive.com';
    const firstname = 'tester';
    const lastname = 'one';
    const regFormObj = {
      email,
      empId,
      firstname,
      lastname,
    };

    it('should define function', () => {
      expect(component.onRegistrationSubmit).toBeDefined();
    });

    it('should not submit the form if form is invalid', () => {
      const buttons = registrationEl.querySelectorAll('button');
      buttons[buttons.length - 1].click();
      expect(component.submitted).toBeTrue();
      expect(alertServiceSpy.clear).toHaveBeenCalledWith();
      expect(instructionServiceSpy.getUsersByEmail).not.toHaveBeenCalled();
      expect(component.registerFormGroup.invalid).toBeTrue();
      expect(component.registerFormGroup.valid).toBeFalse();
    });

    it('should submit the form if form is valid', () => {
      (instructionServiceSpy.getUsersByEmail as jasmine.Spy)
        .withArgs(email)
        .and.returnValue(of([]))
        .and.callThrough();
      (userAccServiceSpy.register as jasmine.Spy)
        .withArgs(regFormObj, info)
        .and.returnValue(of({ message: 'User created' }))
        .and.callThrough();
      (userAccServiceSpy.sendApproveMail as jasmine.Spy)
        .withArgs(regFormObj, info)
        .and.returnValue(of('Email sent'))
        .and.callThrough();
      const inputs = registrationEl.querySelectorAll('input');
      inputs[0].value = empId;
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = email;
      inputs[1].dispatchEvent(new Event('input'));
      inputs[2].value = firstname;
      inputs[2].dispatchEvent(new Event('input'));
      inputs[3].value = lastname;
      inputs[3].dispatchEvent(new Event('input'));
      const buttons = registrationEl.querySelectorAll('button');
      buttons[buttons.length - 1].click();
      fixture.detectChanges();
      expect(component.submitted).toBeTrue();
      expect(alertServiceSpy.clear).toHaveBeenCalledWith();
      expect(instructionServiceSpy.getUsersByEmail).toHaveBeenCalledWith(email);
      expect(instructionServiceSpy.getUsersByEmail).toHaveBeenCalledTimes(1);
      expect(userAccServiceSpy.register).toHaveBeenCalledWith(regFormObj, info);
      expect(userAccServiceSpy.register).toHaveBeenCalledTimes(1);
      expect(userAccServiceSpy.sendApproveMail).toHaveBeenCalledWith(
        regFormObj,
        info
      );
      expect(userAccServiceSpy.sendApproveMail).toHaveBeenCalledTimes(1);
      expect(myOverlayRefSpy.close).toHaveBeenCalledWith();
      expect(
        alertServiceSpy.success
      ).toHaveBeenCalledWith(
        'Registration is Successful! Please check registered email',
        { keepAfterRouteChange: true }
      );
    });

    it('should display User Already Exists alert if registered user alreday exists', () => {
      (instructionServiceSpy.getUsersByEmail as jasmine.Spy)
        .withArgs(email)
        .and.returnValue(of([{regFormObj}]))
        .and.callThrough();
      const inputs = registrationEl.querySelectorAll('input');
      inputs[0].value = empId;
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = email;
      inputs[1].dispatchEvent(new Event('input'));
      inputs[2].value = firstname;
      inputs[2].dispatchEvent(new Event('input'));
      inputs[3].value = lastname;
      inputs[3].dispatchEvent(new Event('input'));
      const buttons = registrationEl.querySelectorAll('button');
      buttons[buttons.length - 1].click();
      fixture.detectChanges();
      expect(component.submitted).toBeTrue();
      expect(alertServiceSpy.clear).toHaveBeenCalledWith();
      expect(instructionServiceSpy.getUsersByEmail).toHaveBeenCalledWith(email);
      expect(instructionServiceSpy.getUsersByEmail).toHaveBeenCalledTimes(1);
      expect(userAccServiceSpy.register).not.toHaveBeenCalled();
      expect(userAccServiceSpy.sendApproveMail).not.toHaveBeenCalled();
      expect(
        alertServiceSpy.error
      ).toHaveBeenCalledWith(
        'User already exists',
        { keepAfterRouteChange: true }
      );
    });

    it('should handle registration error', () => {
      (instructionServiceSpy.getUsersByEmail as jasmine.Spy)
        .withArgs(email)
        .and.returnValue(of([]))
        .and.callThrough();
      (userAccServiceSpy.register as jasmine.Spy)
        .withArgs(regFormObj, info)
        .and.returnValue(throwError({ message: 'Unable to register user!' }))
        .and.callThrough();
      const inputs = registrationEl.querySelectorAll('input');
      inputs[0].value = empId;
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = email;
      inputs[1].dispatchEvent(new Event('input'));
      inputs[2].value = firstname;
      inputs[2].dispatchEvent(new Event('input'));
      inputs[3].value = lastname;
      inputs[3].dispatchEvent(new Event('input'));
      const buttons = registrationEl.querySelectorAll('button');
      buttons[buttons.length - 1].click();
      fixture.detectChanges();
      expect(component.submitted).toBeTrue();
      expect(alertServiceSpy.clear).toHaveBeenCalledWith();
      expect(instructionServiceSpy.getUsersByEmail).toHaveBeenCalledWith(email);
      expect(instructionServiceSpy.getUsersByEmail).toHaveBeenCalledTimes(1);
      expect(userAccServiceSpy.register).toHaveBeenCalledWith(regFormObj, info);
      expect(userAccServiceSpy.register).toHaveBeenCalledTimes(1);
      expect(
        alertServiceSpy.error
      ).toHaveBeenCalledWith(
        instructionServiceSpy.getErrorMessage({ message: 'Unable to register user!' } as HttpErrorResponse),
        { keepAfterRouteChange: true }
      );
    });
  });

  describe('close', () => {
    it('should define function', () => {
      expect(component.close).toBeDefined();
    });

    it('should close the Overlay', () => {
      const buttons = registrationEl.querySelectorAll('button');
      buttons[buttons.length - 2].click();
      expect(myOverlayRefSpy.close).toHaveBeenCalledWith(null);
    });
  });
});
