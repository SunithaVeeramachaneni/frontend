import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Auth } from 'aws-amplify';
import { LoginErrorModalComponent } from '../login-error-modal/login-error-modal.component';

@Component({
  selector: 'app-login-error',
  templateUrl: './login-error.component.html',
  styleUrls: ['./login-error.component.scss']
})
export class LoginErrorComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    const dialogRef = this.dialog.open(LoginErrorModalComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => Auth.signOut({ global: true }));
  }
}
