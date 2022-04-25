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
import { UserDetails } from 'src/app/interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { Buffer } from 'buffer';

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
  dialogType: 'add' | 'edit';
  isfilterTooltipOpen = [];
  displayedPermissions;
  isPopoverOpen = false;
  profileImage = '../../../../../assets/users-icons/Vector.png';
  get roles() {
    return this.userForm.get('roles');
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditUserModalComponent>,
    private sant: DomSanitizer,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit() {
    const userDetails = this.data.user;
    console.log('profileimage is', this.data.user.profileImage);
    // const base64 = Buffer.from(this.data.user.profileImage.data).toString(
    //   'base64'
    // );
    // const base64 = this.arrayBufferToBase64(this.data.user.profileImage);
    // console.log('base64 is', base64);
    // const base64DataString = this.getImageSrc(base64) as string;
    // this.profileImage = base64DataString;
    // this.profileImage = this.getImageSrc(this.data.user.profileImage) as string;
    this.rolesInput = this.data.roles;
    if (Object.keys(userDetails).length === 0) {
      this.dialogType = 'add';
    } else {
      this.dialogType = 'edit';
      this.userForm.patchValue(userDetails);
    }
  }

  getImageSrc = (source: string) => {
    if (source) {
      const base64Image = 'data:image/jpeg;base64,' + source;
      return this.sant.bypassSecurityTrustResourceUrl(base64Image);
    }
  };

  objectComparisonFunction(option, value): boolean {
    return option.id === value.id;
  }
  dataURItoBlob = (dataURI) => {
    // convert base64 to raw binary data held in a string
    const byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const _ia = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      _ia[i] = byteString.charCodeAt(i);
    }

    const dataView = new DataView(arrayBuffer);
    const blob = new Blob([dataView], { type: mimeString });
    return blob;
  };

  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  onFileChange(files: FileList) {
    const selectedFile = files[0];
    this.profileImage = this.sant.bypassSecurityTrustUrl(
      window.URL.createObjectURL(selectedFile)
    ) as string;
    const reader = new FileReader();
    let base64;
    reader.readAsDataURL(selectedFile as Blob);
    reader.onloadend = () => {
      base64 = reader.result as string;
      console.log('base64 is', base64);
      const onlyBase64 = base64.split(',')[1];
      console.log('only is', onlyBase64);
      // const blob = this.dataURItoBlob(base64)
      this.userForm.patchValue({
        profileImage: onlyBase64
      });
    };
  }

  openPermissionsModal(role, index, el) {
    this.isfilterTooltipOpen[index] = true;
    this.displayedPermissions = this.rolesInput.find(
      (iteratedRole) => iteratedRole.name === role.name
    ).permissions;

    // this.dynamicFilterModalTopPosition = el.y - 85 + 'px';
  }

  save() {
    console.log('Saving', this.userForm.value);
    this.dialogRef.close({
      user: { ...this.data.user, ...this.userForm.value },
      action: this.dialogType
    });
  }
}
