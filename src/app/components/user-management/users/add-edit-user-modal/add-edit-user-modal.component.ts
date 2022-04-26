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
  ValidatorFn
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Buffer } from 'buffer';
import { RolesPermissionsService } from '../../services/roles-permissions.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-report-delete-modal',
  templateUrl: './add-edit-user-modal.component.html',
  styleUrls: ['./add-edit-user-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditUserModalComponent implements OnInit {
  userForm = this.fb.group({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    roles: new FormControl([]),
    profileImage: new FormControl('')
  });
  rolesInput: any;
  dialogText: 'addUser' | 'editUser';
  isfilterTooltipOpen = [];
  displayedPermissions;
  isPopoverOpen = false;
  profileImageURI = '../../../../../assets/users-icons/Vector.png';
  profileImage;
  get roles() {
    return this.userForm.get('roles');
  }
  rolePermissions = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditUserModalComponent>,
    private sant: DomSanitizer,
    private roleService: RolesPermissionsService,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit() {
    const userDetails = this.data.user;
    console.log('userdetails', userDetails);
    this.rolesInput = this.data.roles;
    if (Object.keys(userDetails).length === 0) {
      this.dialogText = 'addUser';
      this.getBase64FromImageURI(this.profileImageURI);
    } else {
      this.dialogText = 'editUser';
      let base64;
      console.log(
        'object.keys(userDetails).length',
        Object.keys(userDetails.profileImage).length
      );
      if (typeof userDetails.profileImage === 'string')
        base64 = this.data.user.profileImage;
      else base64 = Buffer.from(this.data.user.profileImage.data).toString();
      this.profileImage = this.getImageSrc(base64) as string;
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
        this.userForm.patchValue({
          profileImage: base64data
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
      return base64;
    };
  }
  onFileChange(files: FileList) {
    const selectedFile = files[0];
    this.profileImage = this.sant.bypassSecurityTrustUrl(
      window.URL.createObjectURL(selectedFile)
    ) as string;
    const base64 = this.getBase64(selectedFile);
    // const blob = this.dataURItoBlob(base64)
    this.userForm.patchValue({
      profileImage: base64
    });
  }

  openPermissionsModal(role, index, el) {
    this.isfilterTooltipOpen[index] = true;
    this.displayedPermissions = this.rolesInput.find(
      (iteratedRole) => iteratedRole.name === role.name
    ).permissions;

    // this.dynamicFilterModalTopPosition = el.y - 85 + 'px';
  }

  getPermissions(role) {
    this.roleService.getRolePermissionsById$(role.id).subscribe((resp) => {
      if (resp && resp.length !== 0) {
        resp.forEach((e) => {
          this.rolePermissions = resp;
        });
      }
    });
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
