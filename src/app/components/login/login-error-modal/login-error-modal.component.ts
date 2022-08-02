import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login-error-modal',
  templateUrl: './login-error-modal.component.html',
  styleUrls: ['./login-error-modal.component.scss']
})
export class LoginErrorModalComponent implements OnInit {
  email: string;
  reason: string;

  constructor(
    private dailogRef: MatDialogRef<LoginErrorModalComponent>,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const { email, reason } = params;
      this.email = email;
      this.reason = reason;
    });
  }

  close() {
    this.dailogRef.close();
  }
}
