import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Observable, Subscription } from 'rxjs';
import { HeaderService } from '../../services/header.service';
import { OidcSecurityService, UserDataResult } from 'angular-auth-oidc-client';

import { LogonUserDetails } from '../../../interfaces';
import { map, tap } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CollabDialogComponent } from './CollabDialog';
import { PeopleService } from './people/people.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('collabButton', { read: ElementRef })
  public collabButtonRef: ElementRef;

  public username: string;
  public userImage: string;
  public sidebarMinimize = false;
  logonUserDetails$: Observable<LogonUserDetails>;

  slackVerification$: Observable<any>;

  @Input() title;

  private minimizeSidebarActionSubscription: Subscription;

  isAuthenticated = false;
  userData$: Observable<UserDataResult>;

  constructor(
    private headerService: HeaderService,
    private commonService: CommonService,
    public oidcSecurityService: OidcSecurityService,
    public dialog: MatDialog
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(CollabDialogComponent, {
      hasBackdrop: false,
      width: '750px',
      disableClose: true,
      data: { positionRelativeToElement: this.collabButtonRef }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  connectToSlack(slackVerification): void {
    console.log(slackVerification);
  }

  ngOnInit() {
    this.slackVerification$ = this.headerService
      .getInstallationURL$()
      .pipe(map((url) => url));
    this.minimizeSidebarActionSubscription =
      this.commonService.minimizeSidebarAction$.subscribe((data) => {
        this.sidebarMinimize = data;
      });
    this.logonUserDetails$ = this.headerService.getLogonUserDetails();
    this.userData$ = this.oidcSecurityService.userData$.pipe(
      tap((res) => {
        this.commonService.setUserInfo(res);
        this.username = res.userData ? res.userData.name.split('.') : [];
        if (this.username.length) {
          const loggedInUser = {
            first_name: this.username[0],
            last_name: this.username[1]
          };
          localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        }
      })
    );
  }

  minimize(e) {
    this.sidebarMinimize = e;
    this.commonService.minimizeSidebar(this.sidebarMinimize);
  }

  ngOnDestroy(): void {
    if (this.minimizeSidebarActionSubscription) {
      this.minimizeSidebarActionSubscription.unsubscribe();
    }
  }

  signout() {
    this.oidcSecurityService.logoffAndRevokeTokens();
  }
}
