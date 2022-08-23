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
  FormArray,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Buffer } from 'buffer';
import { RolesPermissionsService } from '../services/roles-permissions.service';
import { HttpClient } from '@angular/common/http';
import { Permission, Role } from 'src/app/interfaces';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  first,
  map,
  switchMap
} from 'rxjs/operators';
import { defaultProfile, superAdminText } from 'src/app/app.constants';
import { userRolePermissions } from 'src/app/app.constants';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { UsersService } from '../services/users.service';
@Component({
  selector: 'app-report-delete-modal',
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
      WhiteSpaceValidator.noWhiteSpace
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
      Validators.pattern('^[a-zA-Z0-9 ]+$'),
      WhiteSpaceValidator.noWhiteSpace
    ]),
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
      WhiteSpaceValidator.noWhiteSpace
    ]),
    email: new FormControl(
      '',
      [Validators.required, Validators.email, this.emailNameValidator()],
      this.checkIfUserExistsInIDP()
    ),
    roles: new FormControl([], [this.matSelectValidator()]),
    profileImage: new FormControl(''),
    profileImageFileName: new FormControl('')
  });
  emailValidated = false;
  isValidIDPUser = false;
  verificationInProgress = false;

  rolesInput: any;
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
  rolePermissions: Permission[];
  userRolePermissions = userRolePermissions;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditUserModalComponent>,
    private sant: DomSanitizer,
    private roleService: RolesPermissionsService,
    private cdrf: ChangeDetectorRef,
    private usersService: UsersService,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  matSelectValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      !control.value.length ? { selectOne: { value: control.value } } : null;
  }

  emailNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      this.emailValidated = false;
      this.isValidIDPUser = false;

      if (this.data.user.email && this.data.user.email === control.value)
        return null;
      const find = this.data.allusers.findIndex(
        (user) => user.email === control.value
      );
      return find === -1 ? null : { duplicateName: true };
    };
  }
  checkIfUserExistsInIDP(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> =>
      control.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((value) => {
          this.emailValidated = false;
          this.isValidIDPUser = false;
          this.verificationInProgress = true;
          return this.usersService.verifyUserEmail$(value);
        }),
        map((response: any) => {
          this.verificationInProgress = false;
          this.emailValidated = true;
          if (response.isValidUserEmail) {
            this.isValidIDPUser = true;
          } else {
            this.isValidIDPUser = false;
          }
          this.cdrf.detectChanges();
          return !this.isValidIDPUser ? { invalid: true } : null;
        }),
        first()
      );
  }

  ngOnInit() {
    const userDetails = this.data.user;
    this.permissionsList$ = this.data.permissionsList$;
    this.rolesInput = this.data.roles;
    this.rolesList$ = this.data.rolesList$;
    if (Object.keys(userDetails).length === 0) {
      this.dialogText = 'addUser';
      this.profileImage = defaultProfile;
      this.getBase64FromImageURI(defaultProfile);
    } else {
      this.dialogText = 'editUser';
      let base64;
      if (this.data.user.title === superAdminText) {
        this.userForm.disable();
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
      this.userForm.patchValue(userDetails);
    }
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
    let base64;
    reader.readAsDataURL(file as Blob);
    reader.onloadend = () => {
      base64 = reader.result as string;
      const onlybase64 = base64.split(',')[1];
      this.userForm.patchValue({
        profileImage: onlybase64
      });
    };
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
        return permissions.map((perm) => perm.id);
      })
    );
  }

  save() {
    this.dialogRef.close({
      user: {
        ...this.data.user,
        ...this.userForm.value
      },
      action: this.dialogText === 'addUser' ? 'add' : 'edit'
    });
  }

  close() {
    this.dialogRef.close();
  }
}
