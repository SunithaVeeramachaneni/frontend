/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  ChangeDetectorRef
} from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Buffer } from 'buffer';
import { HttpClient } from '@angular/common/http';
import {
  Permission,
  Role,
  UserGroup,
  ValidationError
} from 'src/app/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  first,
  map,
  switchMap,
  tap
} from 'rxjs/operators';
import { of } from 'rxjs';
import { defaultProfile, superAdminText } from 'src/app/app.constants';
import { userRolePermissions } from 'src/app/app.constants';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { UsersService } from '../services/users.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { LoginService } from '../../login/services/login.service';
@Component({
  selector: 'app-add-edit-user-modal',
  templateUrl: './add-edit-user-modal.component.html',
  styleUrls: ['./add-edit-user-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditUserModalComponent implements OnInit {
  userForm = this.fb.group({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
      Validators.pattern('^[a-zA-Z0-9 ]+$'),
      WhiteSpaceValidator.whiteSpace,
      WhiteSpaceValidator.trimWhiteSpace
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
      Validators.pattern('^[a-zA-Z0-9 ]+$'),
      WhiteSpaceValidator.whiteSpace,
      WhiteSpaceValidator.trimWhiteSpace
    ]),
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
      WhiteSpaceValidator.whiteSpace,
      WhiteSpaceValidator.trimWhiteSpace
    ]),
    email: new FormControl(
      '',
      [Validators.required, Validators.email],
      [this.checkIfUserExistsInIDP(), this.checkIfUserExistsInDB()]
    ),
    roles: new FormControl([], [this.matSelectValidator()]),
    usergroup: new FormControl([]),
    profileImage: new FormControl(''),
    profileImageFileName: new FormControl(''),
    validFrom: new FormControl('', [Validators.required]),
    validThrough: new FormControl('', [Validators.required]),
    plantId: new FormControl([], [this.matSelectValidator()])
  });
  emailValidated = false;
  isValidIDPUser = false;
  verificationInProgress = false;
  permissionsArray = [];
  rolesInput: any;
  usergroupInput: any[];
  userGroupList: any[];
  dialogText: 'addUser' | 'editUser';
  isfilterTooltipOpen = [];
  displayedPermissions;
  isPopoverOpen = false;
  profileImage;
  permissionsList$: Observable<any>;
  rolesList$: Observable<Role[]>;
  superAdminText = superAdminText;
  selectedRolePermissions$: Observable<any[]>;
  get roles() {
    return this.userForm.get('roles');
  }
  get usergroup() {
    return this.userForm.get('usergroup');
  }
  get plant() {
    return this.userForm.get('plantId');
  }
  rolePermissions: Permission[];
  userRolePermissions = userRolePermissions;
  errors: ValidationError = {};

  minDate: Date;
  userValidFromDate: Date;
  addingRole$ = new BehaviorSubject<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditUserModalComponent>,
    private sant: DomSanitizer,
    private cdrf: ChangeDetectorRef,
    private usersService: UsersService,
    private http: HttpClient,
    private imageCompress: NgxImageCompressService,
    private loginService: LoginService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  matSelectValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      !control.value?.length ? { selectOne: { value: control.value } } : null;
  }

  checkIfUserExistsInIDP(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      control.markAsTouched();
      return control.valueChanges.pipe(
        delay(500),
        distinctUntilChanged(),
        switchMap((value) => {
          this.emailValidated = false;
          this.isValidIDPUser = false;
          this.verificationInProgress = true;
          return this.usersService.verifyUserEmail$(value.toLowerCase());
        }),
        map((response: any) => {
          this.verificationInProgress = false;
          this.emailValidated = true;
          if (response.isValidUserEmail) {
            this.isValidIDPUser = true;
          } else {
            this.isValidIDPUser = false;
          }
          this.cdrf.markForCheck();
          return !this.isValidIDPUser ? { invalid: true } : null;
        }),
        first()
      );
    };
  }
  checkIfUserExistsInDB(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      of(control.value).pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((value) =>
          this.usersService.getUsersCount$({ email: value.toLowerCase() })
        ),
        map((response) => {
          const { count } = response;
          this.cdrf.markForCheck();
          return count > 0 &&
            control.value !== this.data.user?.email?.toLowerCase()
            ? { exists: true }
            : null;
        }),
        first()
      );
  }

  ngOnInit() {
    if (this.data?.user?.plantId && !Array.isArray(this.data?.user?.plantId)) {
      this.data.user.plantId = this.data.plantsList.filter((plant) =>
        this.data?.user?.plantId?.split(',')?.includes(plant.id)
      );
    }
    const userDetails = this.data?.user;
    this.permissionsList$ = this.data?.permissionsList$;
    this.rolesInput = this.data?.roles?.rows;
    this.rolesList$ = this.data?.rolesList$;
    this.userGroupList = this.data?.usergroup?.items;
    if (this.userForm.get('plantId').value.length === 0) {
      this.usergroupInput = this.userGroupList;
    }
    this.userForm.get('plantId').valueChanges.subscribe(() => {
      const plantsList = [];
      this.userForm.get('plantId')?.value?.forEach((plant) => {
        plantsList.push(plant.id);
      });
      this.usergroupInput = this.userGroupList.filter((group) =>
        plantsList.includes(group.plantId)
      );
    });

    if (Object.keys(userDetails).length === 0) {
      this.dialogText = 'addUser';
      this.profileImage = defaultProfile;
      this.getBase64FromImageURI(defaultProfile);
    } else {
      this.dialogText = 'editUser';
      let base64;
      if (this.data.user.title === superAdminText) {
        this.userForm.disable();
        this.userForm.get('plantId').enable();
      }
      if (typeof userDetails.profileImage === 'string') {
        base64 = this.data.user.profileImage;
      } else {
        base64 = Buffer.from(this.data.user.profileImage).toString();
      }
      this.profileImage = this.getImageSrc(base64) as string;
      this.userForm.patchValue({
        profileImage: base64
      });
      const idArray = userDetails?.userGroups?.split(',');
      userDetails.usergroup = this.usergroupInput?.filter((g) =>
        idArray?.includes(g?.id)
      );
      this.userForm.patchValue(userDetails);
      this.userForm.get('email').disable();
    }

    this.minDate = this.userForm.controls['validFrom'].value || new Date();
    this.userValidFromDate = new Date();
    this.loginService.loggedInUserInfo$
      .pipe(
        tap(({ permissions = [] }) => {
          this.permissionsArray = permissions;
          if (!this.checkPermissions('VIEW_USER_GROUPS')) {
            this.userForm.get('usergroup').disable();
          }
        })
      )
      .subscribe();
  }

  validFromDateChange(validFromDate) {
    if (
      Date.parse(this.userForm.controls['validThrough'].value) <
      Date.parse(this.userForm.controls['validFrom'].value)
    ) {
      this.userForm.controls['validThrough'].setValue(
        this.userForm.get('validFrom').value
      );
    }
    this.userValidFromDate = validFromDate.value;
  }

  getBase64FromImageURI = (uri) => {
    this.http.get(uri, { responseType: 'blob' }).subscribe((res) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        this.profileImage =
          this.sant.bypassSecurityTrustResourceUrl(base64data);
        const onlybase64 = base64data.split(',')[1];
        this.userForm.patchValue({
          profileImage: onlybase64
        });
      };
      reader.readAsDataURL(res);
      return res;
    });
  };

  getImageSrc = (source: string) => {
    if (source) {
      const base64Image = 'data:image/jpeg;base64,' + source;
      return this.sant.bypassSecurityTrustResourceUrl(base64Image);
    }
  };

  objectComparisonFunction(option, value): boolean {
    return option.id === value.id;
  }

  plantComparisonFunction(option, value): boolean {
    return option.id === value;
  }

  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  getBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file as Blob);
    reader.onloadend = () => {
      const base64 = reader.result as string;
      this.resizeImage(base64).then((compressedImage) => {
        const onlybase64 = compressedImage.split(',')[1];
        this.userForm.patchValue({
          profileImage: onlybase64
        });
      });
    };
  }
  async resizeImage(imageBase64) {
    const compressedImage = await this.imageCompress.compressFile(
      imageBase64,
      -1,
      100,
      100,
      240
    );
    return compressedImage;
  }
  onFileChange(event: any) {
    const { files } = event.target as HTMLInputElement;
    const selectedFile = files[0];
    this.profileImage = this.sant.bypassSecurityTrustUrl(
      window.URL.createObjectURL(selectedFile)
    ) as string;
    this.userForm.patchValue({
      profileImageFileName: selectedFile.name
    });
    this.userForm.markAsDirty();
    this.getBase64(selectedFile);
    // const blob = this.dataURItoBlob(base64)
  }

  openPermissionsModal(role, index, el) {
    this.isfilterTooltipOpen[index] = true;
    this.displayedPermissions = this.rolesInput.find(
      (iteratedRole) => iteratedRole.name === role.name
    ).permissions;

    // this.dynamicFilterModalTopPosition = el.y - 85 + 'px';
  }

  getPermissions(role) {
    this.selectedRolePermissions$ = this.rolesList$.pipe(
      map((roles) => {
        const permissions = roles.find((r) => r.id === role.id).permissionIds;
        return permissions;
      })
    );
  }

  save() {
    const newGroupsIds = this.usergroup?.value?.map((obj) => obj?.id);
    const profileImageFileName = this.userForm.get(
      'profileImageFileName'
    ).value;

    if (!profileImageFileName || !profileImageFileName.length) {
      this.userForm.patchValue({
        profileImageFileName: 'default.png'
      });
    }

    const latestPlant =
      this.data.user?.plantId?.map((plant) => plant.id).toString() ===
      this.userForm
        .get('plantId')
        .value?.map((plant) => plant.id)
        .toString()
        ? this.data.user?.plantId?.map((plant) => plant.id).toString()
        : this.userForm
            .get('plantId')
            .value?.map((plant) => plant.id)
            .toString();
    const payload = {
      user: {
        ...this.data.user,
        ...this.userForm.value,
        plantId: latestPlant,
        userGroups: newGroupsIds?.toString()
      },
      action: this.dialogText === 'addUser' ? 'add' : 'edit'
    };
    this.dialogRef.close(payload);
  }

  close() {
    this.dialogRef.close();
  }

  processValidationErrors(controlName: string): boolean {
    const touched = this.userForm.get(controlName).touched;
    const errors = this.userForm.get(controlName).errors;
    this.errors[controlName] = null;
    if (touched && errors) {
      Object.keys(errors).forEach((messageKey) => {
        this.errors[controlName] = {
          name: messageKey,
          length: errors[messageKey]?.requiredLength
        };
      });
    }
    return !touched || this.errors[controlName] === null ? false : true;
  }
  checkPermissions = (permission) =>
    this.loginService.checkUserHasPermission(this.permissionsArray, permission);
}
