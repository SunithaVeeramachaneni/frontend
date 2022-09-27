import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModules } from 'src/app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
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

fdescribe('AddEditUserModalComponent', () => {
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
    }).compileComponents();
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

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  fit('should return true if email ID already exists during edit', () => {
    (usersServiceSpy.getUsersCount$ as jasmine.Spy)
      .withArgs({
        email: 'user1@innovapptive.com'
      })
      .and.returnValue(of({ count: 1 }));
    (usersServiceSpy.verifyUserEmail$ as jasmine.Spy)
      .withArgs('user1@innovapptive.com')
      .and.returnValue(of({ isValidUserEmail: true }));

    component.userForm.get('email').patchValue('user1@innovapptive.com');
    console.log('Form value', component.userForm.value);
    console.log('Form errors', component.userForm.get('email').errors);

    expect(component.userForm.get('email').errors).toBeTrue();
  });

  xit('should return null if email ID is unique', () => {
    (usersServiceSpy.getUsersCount$ as jasmine.Spy)
      .withArgs(
        JSON.stringify({
          email: 'user@innovapptive.com'
        })
      )
      .and.returnValue(of({ count: 0 }));

    component.userForm.patchValue({
      email: 'user@innovapptive.com'
    });

    expect(component.userForm.get('email').errors).toBeNull();
  });
});
