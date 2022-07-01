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
import { OidcSecurityService } from 'angular-auth-oidc-client';

import { ErrorInfo, UserDetails } from '../../../interfaces';
import { filter, map, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CollabDialogComponent } from '../collaboration/CollabDialog';
import { ChatService } from '../collaboration/chats/chat.service';
import { getImageSrc } from '../../utils/imageUtils';
import { DomSanitizer } from '@angular/platform-browser';
import { Buffer } from 'buffer';

import axios from 'axios';
import * as moment from 'moment';
import { UploadDialogComponent } from '../collaboration/chats/upload-dialog/upload-dialog.component';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('collabButton', { read: ElementRef })
  public collabButtonRef: ElementRef;
  @Input() title: string;

  public username: string;
  public userImage: string;
  public sidebarMinimize = false;

  unreadMessageCount: number;

  slackVerification$: Observable<any>;
  msTeamsSignIn$: Observable<any>;

  userData$: Observable<UserDetails>;

  private minimizeSidebarActionSubscription: Subscription;

  private collabWindowSubscription: Subscription;
  private unreadCountSubscription: Subscription;

  constructor(
    public uploadDialog: MatDialog,
    private headerService: HeaderService,
    private commonService: CommonService,
    public oidcSecurityService: OidcSecurityService,
    private chatService: ChatService,
    public dialog: MatDialog,
    private cdrf: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  openDialog(): void {
    const dialogAlreadyOpened = this.chatService.getCollaborationWindowStatus();
    if (dialogAlreadyOpened) {
      return;
    }
    this.unreadMessageCount = 0;
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

  openFileUploadDialog = async () => {
    const dialogRef = this.uploadDialog.open(UploadDialogComponent, {
      disableClose: true,
      hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const info: ErrorInfo = {
          displayToast: true,
          failureResponse: 'throwError'
        };
        const formData = new FormData();
        formData.append('attachment', result);
        formData.append('owner', 'shiva kumar');
        this.chatService.uploadFileToConversation$(formData, info).subscribe(
          (res) => {
            console.log(res);
            // const filesArr = [];
            // filesArr.push(result);
          },
          (err) => {
            // TODO: Display toasty message
          }
        );
      }
    });
  };

  subscribeToTeamsMessages = async () => {
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    this.headerService.subscribeToTeamsMessages$(info).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        // TODO: Display toasty message
      }
    );
  };

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

    const queryParams = {
      surl: encodeURIComponent(window.location.href),
      furl: encodeURIComponent(window.location.href)
    };
    this.slackVerification$ = this.headerService
      .getInstallationURL$(queryParams)
      .pipe(map((url) => url));
    this.minimizeSidebarActionSubscription =
      this.commonService.minimizeSidebarAction$.subscribe((data) => {
        this.sidebarMinimize = data;
      });

    this.userData$ = this.commonService.userInfo$.pipe(
      filter((userInfo) => Object.keys(userInfo).length !== 0),
      tap((userInfo) => {
        const loggedInUser = {
          first_name: userInfo.firstName,
          last_name: userInfo.lastName
        };
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
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
    const { tenantId: configId } = this.commonService.getTenantInfo();
    this.oidcSecurityService.logoffAndRevokeTokens(configId).subscribe();
    sessionStorage.clear();
  }

  profileImage(buffer: any) {
    if (!buffer) return;
    return getImageSrc(Buffer.from(buffer).toString(), this.sanitizer);
  }
}
