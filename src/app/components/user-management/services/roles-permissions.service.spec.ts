/* eslint-disable no-underscore-dangle */
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { isEqual } from 'lodash';
import { of } from 'rxjs';
import { ErrorInfo } from '../../../interfaces';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../shared/services/app.services';
import {
  allRolesMock,
  rolesByID1Mock,
  allPermissionsMock,
  roleIdByPermissionMock,
  addRoleMock,
  updateRoleMock,
  usersMock
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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRolesWithPermissions$', () => {
    it('should define function', () => {
      expect(service.getRolesWithPermissions$).toBeDefined();
    });
    it('needs to get roles with permissions', () => {
      (appServiceSpy._getResp as jasmine.Spy)
        .withArgs(environment.userRoleManagementApiUrl, 'roles', info)
        .and.returnValue(of(allRolesMock));

      //service.getRolesWithPermissions$(info).subscribe((response) => {
      // expect(service.getRolePermissionsById$).toHaveBeenCalled();
      ///expect(response).toEqual(allRolesMock);
      //});
    });
  });

  describe('getPermissions$', () => {
    it('should define function', () => {
      expect(service.getPermissions$).toBeDefined();
    });

    it('needs to get all permissions', () => {
      (appServiceSpy._getResp as jasmine.Spy)
        .withArgs(environment.userRoleManagementApiUrl, 'permissions', info)
        .and.returnValue(of(allPermissionsMock));

      service
        .getPermissions$(info)
        .subscribe((response) => expect(response.length).toEqual(1));
    });
  });

  describe('getRoleById$', () => {
    it('should define function', () => {
      expect(service.getRoleById$).toBeDefined();
    });
    it('needs to get roles by id', () => {
      const id = '1';
      (appServiceSpy._getResp as jasmine.Spy)
        .withArgs(environment.userRoleManagementApiUrl, `roles/${id}`, info)
        .and.returnValue(of(rolesByID1Mock));

      service
        .getRoleById$(id, info)
        .subscribe((response) =>
          expect(isEqual(response, rolesByID1Mock)).toBeTrue()
        );
    });
  });

  describe('getUsersByRoleId$', () => {
    it('should define function', () => {
      expect(service.getUsersByRoleId$).toBeDefined();
    });
    it('needs to get users by roles id', () => {
      const id = '1';
      (appServiceSpy._getResp as jasmine.Spy)
        .withArgs(
          environment.userRoleManagementApiUrl,
          `roles/${id}/users`,
          info
        )
        .and.returnValue(of(usersMock));

      service
        .getUsersByRoleId$(id, info)
        .subscribe((response) =>
          expect(isEqual(response, usersMock)).toBeTrue()
        );
    });
  });

  describe('getRolePermissionsById$', () => {
    it('should define function', () => {
      expect(service.getRolePermissionsById$).toBeDefined();
    });
    it('needs to get roles permissions by id', () => {
      const id = 1;
      (appServiceSpy._getResp as jasmine.Spy)
        .withArgs(
          environment.userRoleManagementApiUrl,
          `roles/${id}/permissions`,
          info
        )
        .and.returnValue(of(roleIdByPermissionMock));

      service
        .getRolePermissionsById$(id, info)
        .subscribe((response) =>
          expect(isEqual(response, roleIdByPermissionMock)).toBeTrue()
        );
    });
  });

  describe('createRole$', () => {
    it('should define function', () => {
      expect(service.createRole$).toBeDefined();
    });

    it('should create role', () => {
      (appServiceSpy._postData as jasmine.Spy)
        .withArgs(
          environment.userRoleManagementApiUrl,
          'roles',
          addRoleMock,
          info
        )
        .and.returnValue(of(addRoleMock));

      service.createRole$(addRoleMock, info).subscribe((response) => {
        //expect(response).toEqual(updateRoleMock);
        expect(appServiceSpy._postData).toHaveBeenCalledWith(
          environment.userRoleManagementApiUrl,
          'roles',
          addRoleMock,
          info
        );
      });
    });
  });

  describe('updateRole$', () => {
    it('should define function', () => {
      expect(service.updateRole$).toBeDefined();
    });

    it('should update tenant', () => {
      (appServiceSpy.patchData as jasmine.Spy)
        .withArgs(
          environment.userRoleManagementApiUrl,
          `roles/${updateRoleMock.id}`,
          updateRoleMock,
          info
        )
        .and.returnValue(of(updateRoleMock));

      service.updateRole$(updateRoleMock, info).subscribe((response) => {
        expect(response).toEqual(updateRoleMock);
        expect(appServiceSpy.patchData).toHaveBeenCalledWith(
          environment.userRoleManagementApiUrl,
          `roles/${updateRoleMock.id}`,
          updateRoleMock,
          info
        );
      });
    });
  });

  describe('deleteRole$', () => {
    it('should define function', () => {
      expect(service.deleteRole$).toBeDefined();
    });

    it('should update tenant', () => {
      (appServiceSpy._removeData as jasmine.Spy)
        .withArgs(
          environment.userRoleManagementApiUrl,
          `roles/${updateRoleMock.id}`,
          info
        )
        .and.returnValue(of(updateRoleMock));

      service.deleteRole$(updateRoleMock, info).subscribe((response) => {
        expect(response).toEqual(updateRoleMock);
        expect(appServiceSpy._removeData).toHaveBeenCalledWith(
          environment.userRoleManagementApiUrl,
          `roles/${updateRoleMock.id}`,
          info
        );
      });
    });
  });

  describe('groupPermissions', () => {
    it('should define function', () => {
      expect(service.groupPermissions).toBeDefined();
    });
    it('return the value', () => {
      const groupArray = {
        Reports: [
          {
            createdAt: '2022-04-19T10:38:41.000Z',
            displayName: 'Create Report',
            id: 1,
            moduleName: 'Reports',
            name: 'CREATE_REPORT',
            updatedAt: '2022-04-19T10:38:41.000Z'
          },
          {
            createdAt: '2022-04-19T10:38:41.000Z',
            displayName: 'Edit Report',
            id: 2,
            moduleName: 'Reports',
            name: 'UPDATE_REPORT',
            updatedAt: '2022-04-19T10:38:41.000Z'
          },
          {
            createdAt: '2022-04-19T10:38:41.000Z',
            displayName: 'Delete Report',
            id: 3,
            moduleName: 'Reports',
            name: 'DELETE_REPORT',
            updatedAt: '2022-04-19T10:38:41.000Z'
          },
          {
            createdAt: '2022-04-19T10:38:41.000Z',
            displayName: 'Share Report',
            id: 4,
            moduleName: 'Reports',
            name: 'SHARE_REPORT',
            updatedAt: '2022-04-19T10:38:41.000Z'
          }
        ]
      };

      const result = service.groupPermissions(allPermissionsMock);
      expect(result).toEqual(groupArray);
    });
  });

  describe('groupToArray', () => {
    it('should define function', () => {
      expect(service.groupToArray).toBeDefined();
    });
    it('return the value', () => {
      const groupArray = [
        {
          name: 'Reports',
          permissions: [
            {
              createdAt: '2022-04-19T10:38:41.000Z',
              displayName: 'Create Report',
              id: '1',
              moduleName: 'Reports',
              name: 'CREATE_REPORT',
              updatedAt: '2022-04-19T10:38:41.000Z'
            },
            {
              createdAt: '2022-04-19T10:38:41.000Z',
              displayName: 'Edit Report',
              id: '2',
              moduleName: 'Reports',
              name: 'UPDATE_REPORT',
              updatedAt: '2022-04-19T10:38:41.000Z'
            },
            {
              createdAt: '2022-04-19T10:38:41.000Z',
              displayName: 'Delete Report',
              id: '3',
              moduleName: 'Reports',
              name: 'DELETE_REPORT',
              updatedAt: '2022-04-19T10:38:41.000Z'
            },
            {
              createdAt: '2022-04-19T10:38:41.000Z',
              displayName: 'Share Report',
              id: '4',
              moduleName: 'Reports',
              name: 'SHARE_REPORT',
              updatedAt: '2022-04-19T10:38:41.000Z'
            }
          ]
        }
      ];
      const result = service.groupToArray(groupArray);
      expect(result.length).toEqual(1);
    });
  });
});
