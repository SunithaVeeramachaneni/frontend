/* eslint-disable no-underscore-dangle */
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { isEqual } from 'lodash';
import { of } from 'rxjs';
import { ErrorInfo } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';
import { AppService } from '../../../shared/services/app.services';
import {
  allRolesMock,
  rolesByID1Mock,
  allPermissionsMock,
  roleIdByPermissionMock,
  addRoleMock,
  updateRoleMock
} from './roles-permissions.mock';

import { RolesPermissionsService } from './roles-permissions.service';

const info = {} as ErrorInfo;

describe('Roles Permissions service', () => {
  let service: RolesPermissionsService;
  let appServiceSpy: AppService;

  beforeEach(() => {
    appServiceSpy = jasmine.createSpyObj('AppService', [
      '_getResp',
      'patchData',
      '_postData',
      '_removeData'
    ]);
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [{ provide: AppService, useValue: appServiceSpy }]
    });
    service = TestBed.inject(RolesPermissionsService);

    (appServiceSpy._getResp as jasmine.Spy)
      .withArgs(environment.userRoleManagementApiUrl, 'roles', info)
      .and.returnValue(of(allRolesMock))
      .and.callThrough();

    (appServiceSpy._getResp as jasmine.Spy)
      .withArgs(environment.userRoleManagementApiUrl, 'permissions', info)
      .and.returnValue(of(allPermissionsMock))
      .and.callThrough();

    (appServiceSpy._getResp as jasmine.Spy)
      .withArgs(
        environment.userRoleManagementApiUrl,
        `roles/1`,
        {} as ErrorInfo
      )
      .and.returnValue(of(rolesByID1Mock))
      .and.callThrough();

    (appServiceSpy._getResp as jasmine.Spy)
      .withArgs(environment.userRoleManagementApiUrl, `roles/1/permissions`, {})
      .and.returnValue(of(roleIdByPermissionMock));

    (appServiceSpy._postData as jasmine.Spy)
      .withArgs(
        environment.userRoleManagementApiUrl,
        'roles',
        addRoleMock,
        {} as ErrorInfo
      )
      .and.returnValue(of(addRoleMock))
      .and.callThrough();

    (appServiceSpy.patchData as jasmine.Spy)
      .withArgs(
        environment.userRoleManagementApiUrl,
        'roles/2',
        updateRoleMock,
        {} as ErrorInfo
      )
      .and.returnValue(of(updateRoleMock))
      .and.callThrough();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('needs to get roles by id and rolesid by permissions', () => {
    const roles$ = service.getRoleById$('1');
    roles$.subscribe((res) => {
      expect(isEqual(res, rolesByID1Mock)).toBeTrue();
    });

    const permissions$ = service.getRolePermissionsById$('1');
    permissions$.subscribe((res) => {
      expect(isEqual(res, roleIdByPermissionMock)).toBeTrue();
    });
  });

  it('needs to get all the roles and permissions', () => {
    // const roles$ = service.getRoles$();
    // roles$.subscribe((res) => {
    //   expect(
    //     isEqual(JSON.stringify(res), JSON.stringify(allRolesMock))
    //   ).toBeTrue();
    // });
    // const permissions$ = service.getPermissions$();
    // permissions$.subscribe((res) => {
    //   expect(
    //     isEqual(JSON.stringify(res), JSON.stringify(allPermissionsMock))
    //   ).toBeTrue();
    // });
  });

  it('should be able to create role', () => {
    const role$ = service.createRole$(addRoleMock);
    role$.subscribe((res) => {
      expect(
        isEqual(JSON.stringify(res), JSON.stringify(addRoleMock))
      ).toBeTrue();
    });
  });

  it('should be able to update role', () => {
    const role$ = service.updateRole$(updateRoleMock);
    role$.subscribe((res) => {
      expect(
        isEqual(JSON.stringify(res), JSON.stringify(updateRoleMock))
      ).toBeTrue();
    });
  });
});
