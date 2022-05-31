/* eslint-disable @typescript-eslint/naming-convention */
import {
  ChangeDetectorRef,
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
import { CollabDialogComponent } from '../collaboration/CollabDialog';
import { ChatService } from '../collaboration/chats/chat.service';

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

  unreadMessageCount: number;

  logonUserDetails$: Observable<LogonUserDetails>;

  slackVerification$: Observable<any>;

  @Input() title;

  private minimizeSidebarActionSubscription: Subscription;

  private collabWindowSubscription: Subscription;
  private unreadCountSubscription: Subscription;

  isAuthenticated = false;
  userData$: Observable<UserDataResult>;

  constructor(
    private headerService: HeaderService,
    private commonService: CommonService,
    public oidcSecurityService: OidcSecurityService,
    private chatService: ChatService,
    public dialog: MatDialog,
    private cdrf: ChangeDetectorRef
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(CollabDialogComponent, {
      hasBackdrop: false,
      width: '750px',
      disableClose: true,
      data: { positionRelativeToElement: this.collabButtonRef }
    });

    dialogRef.afterOpened().subscribe(() => {
      this.chatService.collaborationWindowAction({
        isOpen: true
      });
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.chatService.collaborationWindowAction({
        isOpen: false
      });
    });
  }

  connectToSlack(slackVerification): void {
    window.open(slackVerification.installationURL, '_self');
  }

  ngOnInit() {
    this.unreadCountSubscription = this.chatService.unreadCount$.subscribe(
      (unreadCount) => {
        this.unreadMessageCount = unreadCount;
        this.cdrf.markForCheck();
      }
    );

    this.collabWindowSubscription =
      this.chatService.openCollabWindow$.subscribe((event) => {
        if (event.open) {
          this.openDialog();
        }
      });

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
    if (this.collabWindowSubscription) {
      this.collabWindowSubscription.unsubscribe();
    }
    if (this.unreadCountSubscription) {
      this.unreadCountSubscription.unsubscribe();
    }
  }

  signout() {
    this.oidcSecurityService.logoffAndRevokeTokens();
  }
}
