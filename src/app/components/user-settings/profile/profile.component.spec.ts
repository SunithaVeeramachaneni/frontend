import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { NgxMatIntlTelInputModule } from 'ngx-mat-intl-tel-input';
import { AppMaterialModules } from 'src/app/material.module';
import { userData$ } from 'src/app/shared/components/header/header.component.mock';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastService } from 'src/app/shared/toast';
import { UsersService } from '../../user-management/services/users.service';
import { Base64HelperService } from '../../work-instructions/services/base64-helper.service';

import { ProfileComponent } from './profile.component';

fdescribe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let commonServiceSpy: CommonService;
  let base64ServiceSpy: Base64HelperService;
  let userServiceSpy: UsersService;
  let toastSpy: ToastService;
  let matDialogSpy: MatDialog;

  beforeEach(async () => {
    commonServiceSpy = jasmine.createSpyObj('CommonService', [], {
      userInfo$: userData$
    });
    base64ServiceSpy = jasmine.createSpyObj('Base64HelperService', [
      'getBase64ImageFromSourceUrl'
    ]);
    userServiceSpy = jasmine.createSpyObj('UsersService', [
      'updateUserProfile$'
    ]);
    toastSpy = jasmine.createSpyObj('ToastService', ['show']);
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [
        ReactiveFormsModule,
        AppMaterialModules,
        NgxMatIntlTelInputModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: Base64HelperService, useValue: base64ServiceSpy },
        { provide: UsersService, useValue: userServiceSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: MatDialog, useValue: matDialogSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
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

  describe('editProfile', () => {
    it('should define function', () => {
      expect(component.editProfile).toBeDefined();
    });

    it('should behave...', () => {});
  });

  describe('cancelProfile', () => {
    it('should define function', () => {
      expect(component.cancelProfile).toBeDefined();
    });
  });

  describe('changeProfile', () => {
    it('should define function', () => {
      expect(component.changeProfile).toBeDefined();
    });
  });

  describe('removeProfile', () => {
    it('should define function', () => {
      expect(component.removeProfile).toBeDefined();
    });
  });

  describe('resetProfile', () => {
    it('should define function', () => {
      expect(component.resetProfile).toBeDefined();
    });
  });

  describe('saveProfile', () => {
    it('should define function', () => {
      expect(component.saveProfile).toBeDefined();
    });
  });
});
