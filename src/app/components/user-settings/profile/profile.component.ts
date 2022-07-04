import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  myForm: FormGroup;
  phoneNumber;
  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      phone: [undefined, [Validators.required]]
    });
  }

  ngOnInit(): void {}

  submitPhone() {
    if (this.myForm.valid) {
      this.phoneNumber = this.myForm.get('phone').value;
    }
  }

  get phoneValue() {
    return this.myForm.controls.phone;
  }
}
