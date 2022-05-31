/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Buffer } from 'buffer';
import { RolesPermissionsService } from '../services/roles-permissions.service';
import { HttpClient } from '@angular/common/http';
import { Permission, Role } from 'src/app/interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
      Validators.maxLength(100)
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)
    ]),
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      this.emailNameValidator()
    ]),
    roles: new FormControl([], [this.matSelectValidator()]),
    profileImage: new FormControl('')
  });
  rolesInput: any;
  dialogText: 'addUser' | 'editUser';
  isfilterTooltipOpen = [];
  displayedPermissions;
  isPopoverOpen = false;
  profileImageURI = 'assets/user-management-icons/Vector.png';
  profileImage;
  permissionsList$: Observable<any>;
  rolesList$: Observable<Role[]>;
  selectedRolePermissions$: Observable<any[]>;
  get roles() {
    return this.userForm.get('roles');
  }
  rolePermissions: Permission[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditUserModalComponent>,
    private sant: DomSanitizer,
    private roleService: RolesPermissionsService,
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
      const find = this.data.allusers.findIndex(
        (user) => user.email === control.value
      );
      return find === -1 ? null : { duplicateName: true };
    };
  }

  ngOnInit() {
    const userDetails = this.data.user;
    this.permissionsList$ = this.data.permissionsList$;
    this.rolesInput = this.data.roles;
    this.rolesList$ = this.data.rolesList$;
    if (Object.keys(userDetails).length === 0) {
      this.dialogText = 'addUser';
      this.profileImage = this.profileImageURI;
      this.getBase64FromImageURI(this.profileImageURI);
    } else {
      this.dialogText = 'editUser';
      let base64;
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
      user: { ...this.data.user, ...this.userForm.value },
      action: this.dialogText === 'addUser' ? 'add' : 'edit'
    });
  }

  close() {
    this.dialogRef.close();
  }
}
