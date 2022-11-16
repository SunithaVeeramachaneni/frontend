import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { of } from 'rxjs';
import { AppMaterialModules } from 'src/app/material.module';
import { RolesPermissionsService } from '../services/roles-permissions.service';
import { allRolesMock, usersMock } from '../services/users.mock';
import { UsersService } from '../services/users.service';
import { InactiveUsersComponent } from './inactive-users.component';
import {
  allPermissionsMock,
  roleWithPermissionsMock
} from '../services/roles-permissions.mock';

describe('InactiveUsersComponent', () => {
  let component: InactiveUsersComponent;
  let fixture: ComponentFixture<InactiveUsersComponent>;
  let rolesPermissionsServiceSpy: RolesPermissionsService;
  let usersServiceSpy: UsersService;

  beforeEach(async () => {
    rolesPermissionsServiceSpy = jasmine.createSpyObj(
      'RolesPermissionsService',
      ['getPermissions$', 'getRolesWithPermissions$']
    );

    usersServiceSpy = jasmine.createSpyObj('UsersService', [
      'getRoles$',
      'getUsers$',
      'getUsersCount$'
    ]);

    await TestBed.configureTestingModule({
      declarations: [InactiveUsersComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientModule,
        AppMaterialModules,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        {
          provide: RolesPermissionsService,
          useValue: rolesPermissionsServiceSpy
        },
        { provide: UsersService, useValue: usersServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveUsersComponent);
    component = fixture.componentInstance;

    (rolesPermissionsServiceSpy.getPermissions$ as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(allPermissionsMock));

    (usersServiceSpy.getRoles$ as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(allRolesMock));

    (rolesPermissionsServiceSpy.getRolesWithPermissions$ as jasmine.Spy)
      .withArgs({ includePermissions: true })
      .and.returnValue(of(roleWithPermissionsMock));

    (usersServiceSpy.getUsers$ as jasmine.Spy)
      .withArgs({
        skip: 0,
        limit: 25,
        isActive: false,
        searchKey: '',
        includeRoles: true
      })
      .and.returnValue(of(usersMock));

    (usersServiceSpy.getUsersCount$ as jasmine.Spy)
      .withArgs({ isActive: false, searchKey: '' })
      .and.returnValue(of({ count: usersMock.length }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });
  });

  describe('getDisplayedUsers', () => {
    it('should define function', () => {
      expect(component.getDisplayedUsers).toBeDefined();
    });
    it('should get users data', () => {
      component.getDisplayedUsers();

      component.users$.subscribe((response) => {
        expect(usersServiceSpy.getUsers$).toHaveBeenCalledWith({
          skip: 0,
          limit: 25,
          isActive: false,
          searchKey: ''
        });
        expect(response.data).toEqual(usersMock);
      });
    });
  });

  describe('getUsers', () => {
    it('should define function', () => {
      expect(component.getUsers).toBeDefined();
    });

    it('should get all Users', () => {
      component.skip = 0;
      component.getUsers().subscribe((response) => {
        expect(response).toEqual(usersMock);
        const queryParams = {
          skip: 0,
          limit: 25,
          isActive: false,
          searchKey: '',
          includeRoles: true
        };
        expect(usersServiceSpy.getUsers$).toHaveBeenCalledWith(queryParams);
      });
    });
  });

  describe('handleTableEvent', () => {
    it('should define function', () => {
      expect(component.handleTableEvent).toBeDefined();
    });

    it('should handle table event', () => {
      (usersServiceSpy.getUsers$ as jasmine.Spy)
        .withArgs({
          skip: 1,
          limit: 25,
          isActive: false,
          searchKey: '',
          includeRoles: true
        })
        .and.returnValue(of([]));
      component.fetchUsers$.next({ data: 'load' });

      component.handleTableEvent({ data: 'infiniteScroll' });

      component.users$.subscribe((response) =>
        expect(response.data).toEqual(usersMock)
      );
    });
  });
});
