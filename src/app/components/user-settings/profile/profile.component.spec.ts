import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed
} from '@angular/core/testing';
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
import {
  userInfo,
  userInfo$
} from 'src/app/shared/components/header/header.component.mock';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastService } from 'src/app/shared/toast';
import { UsersService } from '../../user-management/services/users.service';
import { Base64HelperService } from '../../work-instructions/services/base64-helper.service';
import { Buffer } from 'buffer';

import { ProfileComponent } from './profile.component';
import { of } from 'rxjs';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { MockComponent } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { defaultProfile } from 'src/app/app.constants';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';

const { firstName, lastName, title, email, roles, profileImage, contact } =
  userInfo;
const base64String =
  'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let commonServiceSpy: CommonService;
  let base64ServiceSpy: Base64HelperService;
  let userServiceSpy: UsersService;
  let toastSpy: ToastService;
  let matDialogSpy: MatDialog;
  let spinnerSpy: NgxSpinnerService;
  let imageUtilsSpy: ImageUtils;
  let profileDe: DebugElement;
  let profileEl: HTMLElement;

  beforeEach(async () => {
    commonServiceSpy = jasmine.createSpyObj('CommonService', ['setUserInfo'], {
      userInfo$
    });
    base64ServiceSpy = jasmine.createSpyObj('Base64HelperService', [
      'getBase64ImageFromSourceUrl'
    ]);
    userServiceSpy = jasmine.createSpyObj('UsersService', [
      'updateUserProfile$'
    ]);
    toastSpy = jasmine.createSpyObj('ToastService', ['show']);
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    imageUtilsSpy = jasmine.createSpyObj('ImageUtils', ['getImageSrc']);
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ProfileComponent, MockComponent(NgxSpinnerComponent)],
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
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: ImageUtils, useValue: imageUtilsSpy },
        { provide: MatDialog, useValue: matDialogSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    profileDe = fixture.debugElement;
    profileEl = profileDe.nativeElement;
    (imageUtilsSpy.getImageSrc as jasmine.Spy)
      .withArgs(base64String)
      .and.returnValue(`data:image/jpeg;base64,${base64String}`);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should set profile from value', () => {
      component.ngOnInit();

      expect(component.userInfo).toEqual(userInfo);
      expect(component.profileImage).toBe(
        `data:image/jpeg;base64,${base64String}`
      );
      expect(component.profileForm.getRawValue()).toEqual({
        firstName,
        lastName,
        title,
        email,
        roles: roles.map((role) => role.name).join(','),
        profileImage: Buffer.from(profileImage).toString(),
        contact
      });
    });
  });

  describe('editProfile', () => {
    it('should define function', () => {
      expect(component.editProfile).toBeDefined();
    });

    it('should set edit profile related variables & display edit profile form', () => {
      spyOn(component.profileForm, 'reset');

      const buttons = profileEl.querySelectorAll('button');
      buttons[0].click();
      fixture.detectChanges();

      expect(component.profileEditMode).toBeTrue();
      expect(component.profileForm.get('contact').enabled).toBeTrue();
      expect(component.disableRemoveProfile).toBeFalse();
      expect(component.profileForm.reset).toHaveBeenCalledWith({
        firstName,
        lastName,
        title,
        email,
        roles: roles.map((role) => role.name).join(','),
        profileImage: Buffer.from(profileImage).toString(),
        contact
      });
    });
  });

  describe('cancelProfile', () => {
    it('should define function', () => {
      expect(component.cancelProfile).toBeDefined();
    });

    it('should cancel the form without showing cancel modal, If the form is not dirty', () => {
      const buttons = profileEl.querySelectorAll('button');
      buttons[0].click();
      fixture.detectChanges();

      const editFormButtons = profileEl.querySelectorAll('button');
      editFormButtons[1].click();
      fixture.detectChanges();

      expect(component.profileEditMode).toBeFalse();
      expect(commonServiceSpy.setUserInfo).toHaveBeenCalledWith(userInfo);
      expect(component.profileForm.get('contact').disabled).toBeTrue();
    });

    it('should cancel the form by clicking on `yes` from cancel modal, If the form is dirty', () => {
      (matDialogSpy.open as jasmine.Spy).and.returnValue({
        afterClosed: () => of('yes')
      });
      const buttons = profileEl.querySelectorAll('button');
      buttons[0].click();
      fixture.detectChanges();
      component.profileForm.patchValue({ contact: '+918123456788' });
      component.profileForm.markAsDirty();

      const editFormButtons = profileEl.querySelectorAll('button');
      editFormButtons[1].click();
      fixture.detectChanges();

      expect(component.profileEditMode).toBeFalse();
      expect(commonServiceSpy.setUserInfo).toHaveBeenCalledWith(userInfo);
      expect(component.profileForm.get('contact').disabled).toBeTrue();
    });

    it('should not cancel the form by clicking on `no` from the cancel modal, If the form is dirty', () => {
      (matDialogSpy.open as jasmine.Spy).and.returnValue({
        afterClosed: () => of('no')
      });
      const buttons = profileEl.querySelectorAll('button');
      buttons[0].click();
      fixture.detectChanges();
      component.profileForm.patchValue({ contact: '+918123456788' });
      component.profileForm.markAsDirty();

      const editFormButtons = profileEl.querySelectorAll('button');
      editFormButtons[1].click();
      fixture.detectChanges();

      expect(component.profileEditMode).toBeTrue();
      expect(commonServiceSpy.setUserInfo).not.toHaveBeenCalled();
      expect(component.profileForm.get('contact').enabled).toBeTrue();
    });
  });

  describe('changePhoto', () => {
    it('should define function', () => {
      expect(component.changePhoto).toBeDefined();
    });

    it('should change existing profile photo', () => {
      (imageUtilsSpy.getImageSrc as jasmine.Spy).and.returnValue(
        `data:image/jpeg;base64,${base64String}`
      );
      const buttons = profileEl.querySelectorAll('button');
      buttons[0].click();
      fixture.detectChanges();
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File([''], 'image.png'));

      const inputDebugEl = profileDe.query(By.css('input[type=file]'));
      inputDebugEl.nativeElement.files = dataTransfer.files;
      inputDebugEl.nativeElement.dispatchEvent(new InputEvent('change'));
      fixture.detectChanges();

      expect(component.profileImage).toBe(
        `data:image/jpeg;base64,${base64String}`
      );
      expect(component.disableRemoveProfile).toBeFalse();
    });
  });

  describe('removePhoto', () => {
    it('should define function', () => {
      expect(component.removePhoto).toBeDefined();
    });

    it('should remove existing profile and set default profile', fakeAsync(() => {
      (base64ServiceSpy.getBase64ImageFromSourceUrl as jasmine.Spy)
        .withArgs(defaultProfile)
        .and.returnValue(
          of({
            base64Response: `data:image/jpeg;base64,${base64String}`
          }).toPromise()
        );
      const buttons = profileEl.querySelectorAll('button');
      buttons[0].click();
      fixture.detectChanges();

      const editFormButtons = profileEl.querySelectorAll('button');
      editFormButtons[2].click();
      fixture.detectChanges();
      flush();

      expect(component.profileForm.get('profileImage').value).toBe(
        base64String
      );
      expect(component.profileForm.get('profileImage').dirty).toBeTrue();
      expect(component.disableRemoveProfile).toBeTrue();
    }));
  });

  describe('resetPhoto', () => {
    it('should define function', () => {
      expect(component.resetPhoto).toBeDefined();
    });
  });

  describe('saveProfile', () => {
    it('should define function', () => {
      expect(component.saveProfile).toBeDefined();
    });

    it('should allow user to update the profile, If form is valid & dirty', () => {
      spyOn(component.profileForm, 'reset');
      const userProfile = {
        contact: '+918123456788',
        profileImage: base64String
      };
      (userServiceSpy.updateUserProfile$ as jasmine.Spy)
        .withArgs(userInfo.id, userProfile)
        .and.returnValue(of(userProfile));
      const buttons = profileEl.querySelectorAll('button');
      buttons[0].click();
      fixture.detectChanges();
      component.profileForm.patchValue({ contact: '+918123456788' });
      component.profileForm.markAsDirty();

      profileDe.query(By.css('form')).triggerEventHandler('submit', null);

      expect(userServiceSpy.updateUserProfile$).toHaveBeenCalledWith(
        userInfo.id,
        userProfile
      );
      expect(spinnerSpy.show).toHaveBeenCalledWith();
      expect(spinnerSpy.hide).toHaveBeenCalledWith();
      expect(component.profileForm.reset).toHaveBeenCalledWith({
        firstName,
        lastName,
        title,
        email,
        roles: roles.map((role) => role.name).join(','),
        profileImage: Buffer.from(profileImage).toString(),
        contact: '+918123456788'
      });
      expect(component.userInfo).toEqual({
        ...userInfo,
        ...userProfile
      });
      expect(toastSpy.show).toHaveBeenCalledWith({
        text: `Profile updated successfully`,
        type: 'success'
      });
    });
  });
});
