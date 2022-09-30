import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModules } from 'src/app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from '../services/users.service';
import { AddEditUserModalComponent } from './add-edit-user-modal.component';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';

import {
  existingUser,
  rolesInput,
  rolesList$,
  permissionsList$
} from './add-edit-user-modal.component.mock';

describe('AddEditUserModalComponent', () => {
  let component: AddEditUserModalComponent;
  let fixture: ComponentFixture<AddEditUserModalComponent>;
  let dialogSpy: MatDialogRef<AddEditUserModalComponent>;
  let usersServiceSpy: UsersService;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    usersServiceSpy = jasmine.createSpyObj('UsersService', [
      'getUsersCount$',
      'verifyUserEmail$'
    ]);

    await TestBed.configureTestingModule({
      declarations: [AddEditUserModalComponent],
      imports: [
        AppMaterialModules,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            user: existingUser,
            roles: rolesInput,
            permissionsList$,
            rolesList$
          }
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('During edit user', () => {
    beforeEach(() => {
      (usersServiceSpy.getUsersCount$ as jasmine.Spy)
        .withArgs({
          email: 'user1@innovapptive.com'
        })
        .and.returnValue(of({ count: 1 }));
      (usersServiceSpy.verifyUserEmail$ as jasmine.Spy)
        .withArgs('user1@innovapptive.com')
        .and.returnValue(of({ isValidUserEmail: true }));
    });

    it('should return null if input email ID is same as default email ID', () => {
      (usersServiceSpy.getUsersCount$ as jasmine.Spy)
        .withArgs({
          email: 'user1@innovapptive.com'
        })
        .and.returnValue(of({ count: 1 }));
      component.userForm
        .get('email')
        .setAsyncValidators(component.checkIfUserExistsInDB());

      component.userForm.patchValue({
        email: 'user1@innovapptive.com'
      });

      expect(component.userForm.get('email').errors).toBeNull();
    });

    it('should return null if email ID is unique', () => {
      (usersServiceSpy.getUsersCount$ as jasmine.Spy)
        .withArgs({
          email: 'user2@innovapptive.com'
        })
        .and.returnValue(of({ count: 0 }));

      component.userForm
        .get('email')
        .setAsyncValidators(component.checkIfUserExistsInDB());

      component.userForm.patchValue({
        email: 'user2@innovapptive.com'
      });

      expect(component.userForm.get('email').errors).toBeNull();
    });

    it('should return true if input email ID already exists with another user', () => {
      (usersServiceSpy.getUsersCount$ as jasmine.Spy)
        .withArgs({
          email: 'user2@innovapptive.com'
        })
        .and.returnValue(of({ count: 1 }));

      component.userForm
        .get('email')
        .setAsyncValidators(component.checkIfUserExistsInDB());

      component.userForm.patchValue({
        email: 'user2@innovapptive.com'
      });

      expect(component.userForm.get('email').errors.exists).toBeTrue();
    });
  });
});

/**
 * ----------Below describe is for adding user scenario only---------------
 */

describe('AddEditUserModalComponent, for adding user only', () => {
  let component: AddEditUserModalComponent;
  let fixture: ComponentFixture<AddEditUserModalComponent>;
  let dialogSpy: MatDialogRef<AddEditUserModalComponent>;
  let usersServiceSpy: UsersService;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    usersServiceSpy = jasmine.createSpyObj('UsersService', [
      'getUsersCount$',
      'verifyUserEmail$'
    ]);

    await TestBed.configureTestingModule({
      declarations: [AddEditUserModalComponent],
      imports: [
        AppMaterialModules,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            user: {},
            roles: rolesInput,
            permissionsList$,
            rolesList$
          }
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditUserModalComponent);
    component = fixture.componentInstance;
    (usersServiceSpy.getUsersCount$ as jasmine.Spy)
      .withArgs({
        email: 'user1@innovapptive.com'
      })
      .and.returnValue(of({ count: 1 }));
    (usersServiceSpy.verifyUserEmail$ as jasmine.Spy)
      .withArgs('user1@innovapptive.com')
      .and.returnValue(of({ isValidUserEmail: true }));

    fixture.detectChanges();
  });

  it('should return true if input email ID already exists', () => {
    (usersServiceSpy.getUsersCount$ as jasmine.Spy)
      .withArgs({
        email: 'user1@innovapptive.com'
      })
      .and.returnValue(of({ count: 1 }));
    component.userForm
      .get('email')
      .setAsyncValidators(component.checkIfUserExistsInDB());

    component.userForm.patchValue({
      email: 'user1@innovapptive.com'
    });

    expect(component.userForm.get('email').errors.exists).toBeTrue();
  });

  it('should return null if input email ID is unique', () => {
    (usersServiceSpy.getUsersCount$ as jasmine.Spy)
      .withArgs({
        email: 'user1@innovapptive.com'
      })
      .and.returnValue(of({ count: 0 }));
    component.userForm
      .get('email')
      .setAsyncValidators(component.checkIfUserExistsInDB());

    component.userForm.patchValue({
      email: 'user1@innovapptive.com'
    });

    expect(component.userForm.get('email').errors).toBeNull();
  });
});
