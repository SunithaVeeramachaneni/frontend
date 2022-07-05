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
  dialogText = 'addUser';
  readonly superAdminText = superAdminText;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      title: [''],
      email: [''],
      roles: [[]],
      profileImage: [''],
      contact: ['', [Validators.required]]
    });
  }

  objectComparisonFunction(option, value): boolean {
    return option.id === value.id;
  }

  save() {}
}
