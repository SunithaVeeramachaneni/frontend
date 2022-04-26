/* eslint-disable no-underscore-dangle */
import { TestBed } from '@angular/core/testing';
import { isEqual } from 'lodash';
import { of } from 'rxjs';
import { ErrorInfo } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';
import { AppService } from '../../../shared/services/app.services';
import {
  rolesByID1Mock,
  rolesByID2Mock,
  rolesByID3Mock,
  usersMock
} from './users.mock';

import { UsersService } from './users.service';

describe('User service', () => {
  let service: UsersService;
  let appServiceSpy: AppService;

  beforeEach(() => {
    appServiceSpy = jasmine.createSpyObj('AppService', [
      '_getResp',
      'patchData',
      '_postData'
    ]);
    TestBed.configureTestingModule({
      providers: [{ provide: AppService, useValue: appServiceSpy }]
    });
    service = TestBed.inject(UsersService);

    (appServiceSpy._getResp as jasmine.Spy)
      .withArgs(
        environment.userRoleManagementApiUrl,
        `users/1/roles`,
        {} as ErrorInfo
      )
      .and.returnValue(of(rolesByID1Mock));
    (appServiceSpy._getResp as jasmine.Spy)
      .withArgs(environment.userRoleManagementApiUrl, `users/2/roles`, {})
      .and.returnValue(of(rolesByID2Mock));
    (appServiceSpy._getResp as jasmine.Spy)
      .withArgs(environment.userRoleManagementApiUrl, `users/3/roles`, {})
      .and.returnValue(of(rolesByID3Mock));
    (appServiceSpy._getResp as jasmine.Spy)
      .withArgs(
        environment.userRoleManagementApiUrl,
        'users',
        { displayToast: undefined, failureResponse: {} },
        {}
      )
      .and.returnValue(of(usersMock));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('needs to get roles by user ID', () => {
    const roles$ = service.getRoleByUserID$(1);
    roles$.subscribe((res) => {
      expect(isEqual(res, rolesByID1Mock)).toBeTrue();
    });
  });

  it('needs to get all users and their respective roles', () => {
    const users$ = service.getUsers$({});
    users$.subscribe((res) => {
      console.log('Res is', JSON.stringify(res));
    });
  });
});
