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
import { combineLatest, Observable, Subscription } from 'rxjs';
import { HeaderService } from '../../services/header.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';

import { UserDetails } from '../../../interfaces';
import { filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CollabDialogComponent } from '../collaboration/CollabDialog';
import { ChatService } from '../collaboration/chats/chat.service';
import { ImageUtils } from '../../utils/imageUtils';
import { Buffer } from 'buffer';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/components/user-management/services/users.service';
import { environment } from 'src/environments/environment';
import { AuthHeaderService } from '../../services/authHeader.service';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { LoginService } from 'src/app/components/login/services/login.service';

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
    this.headerService.setHeaderTitle(menu);
  }

  sidebarMinimize = false;
  unreadMessageCount: number;
  slackVerification$: Observable<any>;
  userInfo$: Observable<UserDetails>;
  eventSource: any;
  tenantLogo: any;
  isOpen = false;

  private minimizeSidebarActionSubscription: Subscription;
  private collabWindowSubscription: Subscription;
  private unreadCountSubscription: Subscription;

  constructor(
    private headerService: HeaderService,
    private commonService: CommonService,
    public oidcSecurityService: OidcSecurityService,
    private chatService: ChatService,
    public dialog: MatDialog,
    private cdrf: ChangeDetectorRef,
    private router: Router,
    private imageUtils: ImageUtils,
    private usersService: UsersService,
    private authHeaderService: AuthHeaderService,
    private loginService: LoginService
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

  ngOnInit() {
    this.headerTitle$ = this.headerService.headerTitleAction$;

    const ref = this;
    this.loginService.isUserAuthenticated$
      .pipe(
        filter((isUserAuthenticated) => isUserAuthenticated),
        take(1),
        mergeMap(() => {
          const { tenantId } = this.commonService.getTenantInfo();
          return combineLatest([
            this.usersService.getLoggedInUser$(),
            this.headerService.getTenantLogoByTenantId$(tenantId)
          ]);
        })
      )
      .subscribe(([data, { tenantLogo }]) => {
        this.tenantLogo = tenantLogo;
        if (this.tenantLogo) {
          this.tenantLogo = this.imageUtils.getImageSrc(
            Buffer.from(tenantLogo).toString()
          );
        }
        this.commonService.setUserInfo(data);
        if (data.UserSlackDetail && data.UserSlackDetail.slackID) {
          const userSlackDetail = data.UserSlackDetail;
          const { slackID } = userSlackDetail;
          const SSE_URL = `${environment.slackAPIUrl}sse/${slackID}`;

          const { authorization, tenantid } =
            this.authHeaderService.getAuthHeaders(SSE_URL);
          this.eventSource = new EventSourcePolyfill(SSE_URL, {
            headers: {
              authorization,
              tenantid
            }
          });
          this.eventSource.onmessage = async (event: any) => {
            const eventData = JSON.parse(event.data);
            if (!eventData.isHeartbeat) {
              const processedMessageIds = [];
              eventData.forEach((evt: any) => {
                const { message } = evt;
                if (!message.isHeartbeat && message.eventType === 'message') {
                  const audio = new Audio('../assets/audio/notification.mp3');
                  audio.play();
                  processedMessageIds.push(evt.id);
                  const iscollabWindowOpen =
                    ref.chatService.getCollaborationWindowStatus();
                  if (iscollabWindowOpen) {
                    ref.chatService.newMessageReceived(message);
                  } else {
                    let unreadCount = ref.chatService.getUnreadMessageCount();
                    unreadCount = unreadCount + 1;
                    ref.chatService.setUnreadMessageCount(unreadCount);
                  }
                }
              });
              ref.chatService
                .processSSEMessages$(processedMessageIds)
                .subscribe(
                  (response) => {
                    // Do nothing
                  },
                  (err) => {
                    // Do Nothing
                  }
                );
            }
          };
        }
      });

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
    this.isOpen = false;
    const { tenantId: configId } = this.commonService.getTenantInfo();
    this.oidcSecurityService.logoffAndRevokeTokens(configId).subscribe();
    sessionStorage.clear();
  }

  profileImage(buffer: any) {
    return this.imageUtils.getImageSrc(Buffer.from(buffer).toString());
  }

  userSettings() {
    this.isOpen = false;
    this.router.navigate(['/user-settings']);
  }
}
