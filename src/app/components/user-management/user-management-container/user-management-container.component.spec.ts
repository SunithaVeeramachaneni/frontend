import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { AppMaterialModules } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RolesPermissionsService } from '../services/roles-permissions.service';
import { UsersComponent } from '../users/users.component';

import { UserManagementContainerComponent } from './user-management-container.component';

describe('UserManagementContainerComponent', () => {
  let component: UserManagementContainerComponent;
  let fixture: ComponentFixture<UserManagementContainerComponent>;
  let rolesPermissionsServiceSpy: RolesPermissionsService;

  beforeEach(async () => {
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
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
