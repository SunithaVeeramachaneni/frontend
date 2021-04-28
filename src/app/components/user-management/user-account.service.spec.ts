import { async, TestBed } from "@angular/core/testing";
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ErrorInfo } from "../../interfaces/error-info";
import { UserOptional } from "../../interfaces/user";
import { InstructionService } from "../workInstructions-home/categories/workinstructions/instruction.service";
import { User } from './user';
import { UserAccountService } from './user-account.service';

const userFormData = {
  empId: '1000111',
  email: 'tester.one@innovapptive.com',
  firstname: 'tester',
  lastname: 'one'
};

describe('UserAccountService', () => {
  let service: UserAccountService;
  let instructionServiceSpy: InstructionService;
  let router: Router;

  beforeEach(async(() => {
    instructionServiceSpy = jasmine.createSpyObj('InstructionService', [
      'getUsersByEmail',
      'sendApprovalEmail',
      'addUser'
    ]);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: InstructionService, useValue: instructionServiceSpy }
      ]
    });
    service = TestBed.inject(UserAccountService);
    router = TestBed.inject(Router);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('userValue', () => {
    it('should return userValue', () => {
      const response = [
        {
          "id": '57',
          "first_name": "tester",
          "last_name": "one",
          "email": "tester.one@innovapptive.com",
          "password": "1000111tes",
          "role": "user",
          "empId": "1000111"
        }
      ];
      service['userSubject'] = new BehaviorSubject<User>(response[0]);
      expect(service.userValue).toEqual(response[0]);
    });

    it('should return null if userSubject not set', () => {
      service['userSubject'] = undefined;
      expect(service.userValue).toBeNull();
    });
  });

  describe('login', () => {
    it('should define function', () => {
      expect(service.login).toBeDefined();
    });

    it('should make login rest call', () => {
      const { email } = userFormData;
      const password = '1000111tes';
      const response = [
        {
          "id": '57',
          "first_name": "tester",
          "last_name": "one",
          "email": "tester.one@innovapptive.com",
          "password": "1000111tes",
          "role": "user",
          "empId": "1000111"
        }
      ];
      (instructionServiceSpy.getUsersByEmail as jasmine.Spy)
        .withArgs(email, {} as ErrorInfo)
        .and.returnValue(of(response))
        .and.callThrough();
      const login = service.login(email, password);
      login.subscribe(
        data => expect(data).toEqual(response)
      );
      expect(instructionServiceSpy.getUsersByEmail).toHaveBeenCalledWith(email, {} as ErrorInfo);
    });
  });

  describe('register', () => {
    it('should define function', () => {
      expect(service.register).toBeDefined();
    });

    it('should make register user rest call', () => {
      const { empId, email, firstname: first_name, lastname: last_name } = userFormData;
      const password = `${empId}${first_name.substring(0, 3).toLowerCase()}`;
      const user = {
        empId,
        email,
        first_name,
        last_name,
        password,
        role: 'user'
      } as UserOptional;
      const response = { ...user, id: '1' } as User;
      delete response.password;
      (instructionServiceSpy.addUser as jasmine.Spy)
        .withArgs(user, {} as ErrorInfo)
        .and.returnValue(of(response))
        .and.callThrough();
      const register = service.register(userFormData);
      register.subscribe(
        data => expect(data).toEqual(response)
      );
      expect(instructionServiceSpy.addUser).toHaveBeenCalledWith(user, {} as ErrorInfo);
    });
  });

  describe('sendApproveMail', () => {
    it('should define function', () => {
      expect(service.sendApproveMail).toBeDefined();
    });

    it('should make approval mail rest call', () => {
      const { empId, email, firstname, lastname } = userFormData;
      const mailOptions = {
        "to": email,
        "from": "info@innovapptive.com",
        "subject": 'Work Instructions Access Request - Approved | ' + firstname + " "  + lastname,
        "text": "Hello",
        "html": "<h3> Hey " + firstname + ", </h3></br>" +
          "<h2> Welcome to WorkInstructions!</h2></br>" +
          "<p> Here is the information to access WorkInstructions</p></br>" +
          "<p> Username: " +  "<b>" +  "Your registered Email" + "</b>" + "</p></br>" +
          "<p>Password: " + "Combination of " + "<b>" + "Employee Id " + "</b>"  + "and " + "<b>" + "first 3 characters of the first name" + "</b>" + "</p></br>" +
          "<p>" +  "Ex: If Employee ID is ‘51001234’ and First Name is ‘John’ then Password must be ‘51001234joh’" + "</p></br>"
      };
      (instructionServiceSpy.sendApprovalEmail as jasmine.Spy)
        .withArgs(mailOptions, {} as ErrorInfo)
        .and.returnValue(of({ data: 'success'}))
        .and.callThrough();
      const mail = service.sendApproveMail(userFormData);
      mail.subscribe(
        data => expect(data).toEqual({ data: 'success'})
      );
      expect(instructionServiceSpy.sendApprovalEmail).toHaveBeenCalledWith(mailOptions, {} as ErrorInfo);
    });
  });

  describe('logout', () => {
    it('should define function', () => {
      expect(service.logout).toBeDefined();
    });

    it('should redirect to signin', () => {
      spyOn(router, 'navigate');
      const response = [
        {
          "id": '57',
          "first_name": "tester",
          "last_name": "one",
          "email": "tester.one@innovapptive.com",
          "password": "1000111tes",
          "role": "user",
          "empId": "1000111"
        }
      ];
      service['userSubject'] = new BehaviorSubject<User>(response[0]);
      service.logout();
      expect(service.userValue).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/signin']);
    });
  });

});
