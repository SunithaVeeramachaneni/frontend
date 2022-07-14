/* eslint-disable @typescript-eslint/naming-convention */
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
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
import { ImageUtils } from '../../utils/imageUtils';
import { Buffer } from 'buffer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('collabButton', { read: ElementRef })
  public collabButtonRef: ElementRef;
  @Output() SideNavToggle = new EventEmitter();

  headerTitle$: Observable<string>;

  @Input() set selectedMenu(menu) {
    this.commonService.setHeaderTitle(menu);
  }

  public username: string;
  public userImage: string;
  public sidebarMinimize = false;

  unreadMessageCount: number;

  slackVerification$: Observable<any>;
  msTeamsSignIn$: Observable<any>;

  userInfo$: Observable<UserDetails>;

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
    private router: Router,
    private imageUtils: ImageUtils
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
      panelClass: 'collabDialog',
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
    this.headerTitle$ = this.commonService.headerTitleAction$;

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

    this.userInfo$ = this.commonService.userInfo$.pipe(
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

  openSidenav() {
    this.SideNavToggle.emit();
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
    return this.imageUtils.getImageSrc(Buffer.from(buffer).toString());
  }

  userSettings() {
    this.router.navigate(['/user-settings']);
  }
}
