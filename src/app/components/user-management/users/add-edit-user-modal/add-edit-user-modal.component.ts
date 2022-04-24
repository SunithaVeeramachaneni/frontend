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
    const base64 = Buffer.from(this.data.user.profileImage).toString('base64');
    this.profileImage = this.getImageSrc(base64) as string;
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
      this.userForm.patchValue({
        profileImage: base64
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
    this.dialogRef.close({
      user: { ...this.data.user, ...this.userForm.value },
      action: this.dialogType
    });
  }
}
