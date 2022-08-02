import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { TenantService } from '../../tenant-management/services/tenant.service';
import { LoginErrorModalComponent } from '../login-error-modal/login-error-modal.component';

@Component({
  selector: 'app-login-error',
  templateUrl: './login-error.component.html',
  styleUrls: ['./login-error.component.scss']
})
export class LoginErrorComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private tenantService: TenantService,
    private oidcSecurityService: OidcSecurityService
  ) {}

  ngOnInit(): void {
    const dialogRef = this.dialog.open(LoginErrorModalComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      const { tenantId } = this.tenantService.getTenantInfo();
      this.oidcSecurityService.logoffAndRevokeTokens(tenantId).subscribe();
      sessionStorage.clear();
    });
  }
}
