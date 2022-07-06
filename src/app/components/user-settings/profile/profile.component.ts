import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { superAdminText } from 'src/app/app.constants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  profileImage = 'assets/user-management-icons/Vector.png';
  profileEditMode = false;

  readonly superAdminText = superAdminText;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: [{ value: 'Kavya', disabled: true }],
      lastName: [{ value: 'Krishna', disabled: true }],
      title: [{ value: 'Developer', disabled: true }],
      email: [
        { value: 'kavya.koka@innovapptive.com', disabled: true },
        Validators.required
      ],
      roles: [{ value: 'Developer', disabled: true }],
      profileImage: [{ value: '' }],
      contact: [{ value: '+917286034557', disabled: true }]
    });
  }

  objectComparisonFunction(option, value): boolean {
    return option.id === value.id;
  }

  saveProfile() {
    this.profileEditMode = false;
    this.profileForm.controls.contact.disable();
  }

  editProfile() {
    this.profileEditMode = true;
    this.profileForm.controls.contact.enable();
  }

  cancelProfile() {
    this.profileEditMode = false;
    this.profileForm.controls.contact.disable();
  }
}
