import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { AppMaterialModules } from 'src/app/material.module';
import { HeaderService } from 'src/app/shared/services/header.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbService } from 'xng-breadcrumb';
import { RolesPermissionsService } from '../services/roles-permissions.service';
import { UsersComponent } from '../users/users.component';

import { UserManagementContainerComponent } from './user-management-container.component';

describe('UserManagementContainerComponent', () => {
  let component: UserManagementContainerComponent;
  let fixture: ComponentFixture<UserManagementContainerComponent>;
  let rolesPermissionsServiceSpy: RolesPermissionsService;
  let breadcrumbService: BreadcrumbService;
  let headerServiceSpy: HeaderService;

  beforeEach(async () => {
    headerServiceSpy = jasmine.createSpyObj('HeaderService', [
      'setHeaderTitle'
    ]);
    await TestBed.configureTestingModule({
      declarations: [
        UserManagementContainerComponent,
        MockComponent(UsersComponent)
      ],
      imports: [
        SharedModule,
        AppMaterialModules,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: RolesPermissionsService,
          useValue: rolesPermissionsServiceSpy
        },
        {
          provide: HeaderService,
          useValue: headerServiceSpy
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    breadcrumbService = TestBed.inject(BreadcrumbService);
    fixture = TestBed.createComponent(UserManagementContainerComponent);
    component = fixture.componentInstance;
    spyOn(breadcrumbService, 'set');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
