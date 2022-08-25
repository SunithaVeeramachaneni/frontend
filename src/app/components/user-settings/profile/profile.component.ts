import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { defaultProfile } from 'src/app/app.constants';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';
import { Buffer } from 'buffer';
import { Base64HelperService } from '../../work-instructions/services/base64-helper.service';
import { UsersService } from '../../user-management/services/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserInfo } from 'src/app/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'src/app/shared/toast';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { CancelModalComponent } from '../cancel-modal/cancel-modal.component';
import { LoginService } from '../../login/services/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('contact')
  conatct: NgxMatIntlTelInputComponent;
  profileForm: FormGroup;
  profileImage: string | SafeResourceUrl;
  profileImageFileName: string;
  profileEditMode = false;
  disableRemoveProfile = false;
  userInfo: UserInfo;

  constructor(
    private fb: FormBuilder,
    private base64Service: Base64HelperService,
    private userService: UsersService,
    private spinner: NgxSpinnerService,
    private toast: ToastService,
    private imageUtils: ImageUtils,
    public dialog: MatDialog,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.profileImage = defaultProfile;

    this.profileForm = this.fb.group({
      firstName: [{ value: '', disabled: true }],
      lastName: [{ value: '', disabled: true }],
      title: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      roles: [{ value: '', disabled: true }],
      profileImage: [{ value: '' }],
      contact: [{ value: '', disabled: true }]
    });

    this.loginService.loggedInUserInfo$.subscribe((userInfo) => {
      if (Object.keys(userInfo).length) {
        const {
          firstName,
          lastName,
          title,
          email,
          roles,
          profileImage,
          contact
        } = userInfo;

        this.userInfo = userInfo;
        this.profileImage = this.imageUtils.getImageSrc(
          Buffer.from(profileImage).toString()
        );
        this.profileForm.setValue({
          firstName,
          lastName,
          title,
          email,
          roles: roles.map((role) => role.name).join(', '),
          profileImage: Buffer.from(profileImage).toString(),
          contact
        });
      }
    });
  }

  editProfile() {
    this.profileEditMode = true;
    this.profileForm.controls.contact.enable();
    this.disableRemoveProfile = false;
    this.profileForm.reset(this.profileForm.getRawValue());
  }

  cancelProfile() {
    if (this.profileForm.dirty) {
      const cancelReportRef = this.dialog.open(CancelModalComponent);
      cancelReportRef.afterClosed().subscribe((res) => {
        if (res === 'yes') {
          this.profileEditMode = false;
          this.loginService.setLoggedInUserInfo(this.userInfo);
          this.profileForm.controls.contact.disable();
          if (this.userInfo.contact === null) {
            this.conatct.reset();
          }
        }
      });
    } else {
      this.profileEditMode = false;
      this.loginService.setLoggedInUserInfo(this.userInfo);
      this.profileForm.controls.contact.disable();
    }
  }

  changePhoto(event: any) {
    let base64: string;
    const { files } = event.target as HTMLInputElement;
    const reader = new FileReader();
    this.profileImageFileName = files[0].name;
    reader.readAsDataURL(files[0]);
    reader.onloadend = () => {
      base64 = reader.result as string;
      const profileImage = base64.split(',')[1];
      this.profileForm.patchValue({
        profileImage
      });
      this.profileImage = this.imageUtils.getImageSrc(profileImage);
      this.profileForm.get('profileImage').markAsDirty();
      this.disableRemoveProfile = false;
    };
  }

  removePhoto() {
    this.profileImage = defaultProfile;
    this.profileImageFileName = 'default.png';
    (async () => {
      const { base64Response } =
        await this.base64Service.getBase64ImageFromSourceUrl(defaultProfile);
      this.profileForm.patchValue({
        profileImage: base64Response.split(',')[1]
      });
      this.profileForm.get('profileImage').markAsDirty();
      this.disableRemoveProfile = true;
    })();
  }

  resetPhoto(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = '';
  }

  saveProfile() {
    if (this.profileForm.valid && this.profileForm.dirty) {
      this.spinner.show();
      const userProfile = this.profileForm.value;
      userProfile.profileImageFileName = this.profileImageFileName;
      this.userService
        .updateUserProfile$(this.userInfo.id, userProfile)
        .subscribe((response) => {
          this.spinner.hide();
          if (Object.keys(response).length) {
            this.profileForm.reset(this.profileForm.getRawValue());
            this.userInfo = { ...this.userInfo, ...response };
            this.loginService.setLoggedInUserInfo(this.userInfo);
            this.toast.show({
              text: `Profile updated successfully`,
              type: 'success'
            });
          }
        });
    }
  }
}
