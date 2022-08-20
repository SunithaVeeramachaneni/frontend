/* eslint-disable no-underscore-dangle */
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { isEqual } from 'lodash-es';
import { of } from 'rxjs';
import { ErrorInfo } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';
import { AppService } from '../../../shared/services/app.services';
import {
  addUserMock,
  allRolesMock,
  allUsersWithRolesMock,
  preparedUserMock,
  rolesByID1Mock,
  rolesByID2Mock,
  rolesByID3Mock,
  updateUserMock,
  usersMock
} from './users.mock';

import { UsersService } from './users.service';

const info = {} as ErrorInfo;

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
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [{ provide: AppService, useValue: appServiceSpy }]
    });
    service = TestBed.inject(UsersService);

    (appServiceSpy._getResp as jasmine.Spy)
      .withArgs(
        environment.userRoleManagementApiUrl,
        `users/1/roles`,
        {} as ErrorInfo
      )
      .and.returnValue(of(rolesByID1Mock))
      .and.callThrough();
    (appServiceSpy._getResp as jasmine.Spy)
      .withArgs(environment.userRoleManagementApiUrl, `users/2/roles`, {})
      .and.returnValue(of(rolesByID2Mock));
    (appServiceSpy._getResp as jasmine.Spy)
      .withArgs(environment.userRoleManagementApiUrl, `users/3/roles`, {})
      .and.returnValue(of(rolesByID3Mock));
    (appServiceSpy._getResp as jasmine.Spy)
      .withArgs(environment.userRoleManagementApiUrl, 'users', info, {
        isActive: true
      })
      .and.returnValue(of(usersMock))
      .and.callThrough();
    (appServiceSpy._getResp as jasmine.Spy)
      .withArgs(
        environment.userRoleManagementApiUrl,
        'users/count',
        {} as ErrorInfo,
        { isActive: true }
      )
      .and.returnValue(of({ count: 3 }))
      .and.callThrough();
    (appServiceSpy._getResp as jasmine.Spy)
      .withArgs(environment.userRoleManagementApiUrl, 'roles', info)
      .and.returnValue(of(allRolesMock))
      .and.callThrough();

    (appServiceSpy.patchData as jasmine.Spy)
      .withArgs(
        environment.userRoleManagementApiUrl,
        'users/4',
        { isActive: false },
        {} as ErrorInfo
      )
      .and.returnValue(of(addUserMock))
      .and.callThrough();

    (appServiceSpy._postData as jasmine.Spy)
      .withArgs(
        environment.userRoleManagementApiUrl,
        'users',
        addUserMock,
        {} as ErrorInfo
      )
      .and.returnValue(of(addUserMock))
      .and.callThrough();

    (appServiceSpy._postData as jasmine.Spy)
      .withArgs(
        environment.userRoleManagementApiUrl,
        'users/5',
        updateUserMock,
        {} as ErrorInfo
      )
      .and.returnValue(of(updateUserMock))
      .and.callThrough();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('needs to get roles by user ID', () => {
    const roles$ = service.getRolesByUserID$(1);
    roles$.subscribe((res) => {
      expect(isEqual(res, rolesByID1Mock)).toBeTrue();
    });

    const roles2$ = service.getRolesByUserID$(2);
    roles2$.subscribe((res) => {
      expect(isEqual(res, rolesByID2Mock)).toBeTrue();
    });

    const roles3$ = service.getRolesByUserID$(3);
    roles3$.subscribe((res) => {
      expect(isEqual(res, rolesByID3Mock)).toBeTrue();
    });
  });

  xit('needs to get all users and their respective roles', () => {
    const users$ = service.getUsers$({});
    users$.subscribe((res) => {
      expect(
        isEqual(JSON.stringify(res), JSON.stringify(allUsersWithRolesMock))
      ).toBeTrue();
    });
  });

  // fit('should be able to create user', () => {
  //   const users$ = service.createUser$(addUserMock);
  //   users$.subscribe((res) => {
  //     expect(
  //       isEqual(JSON.stringify(res), JSON.stringify(addUserMock))
  //     ).toBeTrue();
  //   });
  // });

  // fit('should be able to update user', () => {
  //   const users$ = service.updateUser$(updateUserMock);
  //   users$.subscribe((res) => {
  //     expect(
  //       isEqual(JSON.stringify(res), JSON.stringify(updateUserMock))
  //     ).toBeTrue();
  //   });
  // });

  // fit('should be able to deactivate user', () => {
  //   const users$ = service.deactivateUser$(addUserMock);
  //   users$.subscribe((res) => {
  //     expect(
  //       isEqual(JSON.stringify(res), JSON.stringify(addUserMock))
  //     ).toBeTrue();
  //   });
  // });

  describe('updateUserProfile$', () => {
    it('should define function', () => {
      expect(service.updateUserProfile$).toBeDefined();
    });

    it('should update user profile', () => {
      const userProfile = {
        contact: '+918123456789',
        profileImage:
          'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
      };
      (appServiceSpy.patchData as jasmine.Spy)
        .withArgs(
          environment.userRoleManagementApiUrl,
          `users/profile/1`,
          userProfile,
          info
        )
        .and.returnValue(of(null));

      service.updateUserProfile$(1, userProfile, info).subscribe((response) => {
        expect(response).toEqual(userProfile);
        expect(appServiceSpy.patchData).toHaveBeenCalledWith(
          environment.userRoleManagementApiUrl,
          `users/profile/1`,
          userProfile,
          info
        );
      });
    });
  });
});
