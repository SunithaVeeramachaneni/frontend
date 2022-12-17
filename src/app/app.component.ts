import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';
import { CommonService } from './shared/services/common.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter, mergeMap, take, tap } from 'rxjs/operators';
import { defaultLanguage, routingUrls } from './app.constants';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from './components/user-management/services/users.service';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { Permission, Tenant, UserInfo } from './interfaces';
import { LoginService } from './components/login/services/login.service';
import { environment } from 'src/environments/environment';
import { ChatService } from './shared/components/collaboration/chats/chat.service';
import { AuthHeaderService } from './shared/services/authHeader.service';
import { TenantService } from './components/tenant-management/services/tenant.service';
import { ImageUtils } from './shared/utils/imageUtils';
import { Buffer } from 'buffer';
import { PermissionsRevokeInfoModalComponent } from './shared/components/permissions-revoke-info-modal/permissions-revoke-info-modal.component';
import { MatDialog } from '@angular/material/dialog';

import { UserIdleService } from 'angular-user-idle';
import { debounce } from './shared/utils/debounceMethod';
import { PeopleService } from './shared/components/collaboration/people/people.service';
import { SseService } from './shared/services/sse.service';
import { ILayoutConf, LayoutService } from './shared/services/layout.service';

const {
  dashboard,
  reports,
  spareParts,
  maintenance,
  workInstructions,
  drafts,
  favorites,
  recents,
  published,
  files,
  userManagement,
  rolesPermissions,
  inActiveTenants,
  inActiveUsers,
  tenantManagement
} = routingUrls;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
  menus = [
    {
      title: dashboard.title,
      url: dashboard.url,
      imageName: 'dashboard',
      showSubMenu: false,
      permission: dashboard.permission,
      subPages: [
        {
          title: reports.title,
          url: reports.url,
          permission: reports.permission
        }
      ],
      disable: false
    },
    {
      title: tenantManagement.title,
      url: tenantManagement.url,
      imageName: 'tenant-management',
      showSubMenu: false,
      permission: tenantManagement.permission,
      subPages: null,
      disable: false
    },
    {
      title: userManagement.title,
      url: userManagement.url,
      imageName: 'user-management',
      showSubMenu: false,
      permission: userManagement.permission,
      subPages: [
        {
          title: rolesPermissions.title,
          url: rolesPermissions.url,
          permission: rolesPermissions.permission
        },
        {
          title: inActiveUsers.title,
          url: inActiveUsers.url,
          permission: inActiveUsers.permission
        }
      ],
      disable: false
    },
    {
      title: maintenance.title,
      url: maintenance.url,
      imageName: 'maintenance',
      showSubMenu: false,
      permission: maintenance.permission,
      subPages: null,
      disable: false
    },
    {
      title: spareParts.title,
      url: spareParts.url,
      imageName: 'spare-parts',
      showSubMenu: false,
      permission: spareParts.permission,
      subPages: null,
      disable: false
    },
    {
      title: workInstructions.title,
      url: workInstructions.url,
      imageName: 'work-instructions',
      showSubMenu: false,
      permission: workInstructions.permission,
      subPages: [
        {
          title: favorites.title,
          url: favorites.url,
          permission: favorites.permission
        },
        {
          title: drafts.title,
          url: drafts.url,
          permission: drafts.permission
        },
        {
          title: published.title,
          url: published.url,
          permission: published.permission
        },
        {
          title: recents.title,
          url: recents.url,
          permission: recents.permission
        },
        {
          title: files.title,
          url: files.url,
          permission: files.permission
        }
      ],
      disable: false
    }
  ];
  currentRouteUrl: string;
  selectedMenu: string;
  eventSourceCollaboration: any;
  eventSourceJitsi: any;
  eventSourceUpdateUserPresence: any;

  isNavigated = false;
  isUserAuthenticated = false;
  userInfo$: Observable<UserInfo>;
  displayLoader$: Observable<boolean>;
  displayLoader: boolean;

  isUserOnline = false;

  layoutConf: ILayoutConf = {};
  adminContainerClasses: any = {};
  subMenuShow = true;

  private layoutConfSub: Subscription;
  private routerEventSub: Subscription;

  constructor(
    private commonService: CommonService,
    private router: Router,
    private cdrf: ChangeDetectorRef,
    private translateService: TranslateService,
    private usersService: UsersService,
    private loginService: LoginService,
    private authHeaderService: AuthHeaderService,
    private chatService: ChatService,
    private tenantService: TenantService,
    private peopleService: PeopleService,
    private imageUtils: ImageUtils,
    private dialog: MatDialog,
    private userIdle: UserIdleService,
    private sseService: SseService,
    private layout: LayoutService
  ) {
    this.routerEventSub = router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((routeChange: NavigationEnd) => {
        this.layout.adjustLayout({ route: routeChange.url });
      });
  }

  @HostListener('document:mousemove', ['$event'])
  @debounce()
  onMouseMove(e) {
    this.updateUserPresence();
  }

  @HostListener('click', ['$event.target'])
  @debounce()
  onClick(e) {
    this.updateUserPresence();
  }

  @HostListener('window:keyup', ['$event'])
  @debounce()
  keyEvent(event: KeyboardEvent) {
    this.updateUserPresence();
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    this.removeUserPresence();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    // return false;
    // return false; will trigger a confirmation alert asking if you really want to close the application tab/window...
  }

  onSignOut = () => {
    this.removeUserPresence();
  };

  updateUserPresence = () => {
    if (this.isUserOnline || !this.isUserAuthenticated) return;
    this.usersService.setUserPresence$().subscribe((resp) => {
      this.userIdle.startWatching();
      this.isUserOnline = true;
      const userInfo = this.loginService.getLoggedInUserInfo();
      if (Object.keys(userInfo).length) {
        userInfo.online = true;
        this.loginService.setLoggedInUserInfo(userInfo);
      }
    });
  };

  removeUserPresence = () => {
    this.usersService.removeUserPresence$().subscribe((resp) => {
      this.isUserOnline = false;
      const userInfo = this.loginService.getLoggedInUserInfo();
      if (Object.keys(userInfo).length) {
        userInfo.online = false;
        this.loginService.setLoggedInUserInfo(userInfo);
      }
      this.userIdle.stopWatching();
    });
  };

  ngOnInit() {
    console.log(this.layout);
    this.layoutConf = this.layout.layoutConf;
    console.log(this.layoutConf);
    this.layoutConfSub = this.layout.layoutConf$.subscribe((layoutConf) => {
      this.layoutConf = layoutConf;
      this.adminContainerClasses = this.updateAdminContainerClasses(
        this.layoutConf
      );
      if (this.layoutConf.sidebarStyle === 'full') {
        this.subMenuShow = true;
      } else if (this.layoutConf.sidebarStyle === 'compact') {
        this.subMenuShow = false;
      }
      this.cdrf.markForCheck();
    });

    //Start watching for user inactivity.
    this.userIdle.startWatching();
    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe((count) => {
      if (count === 1) {
        this.removeUserPresence();
      }
    });

    const ref = this;
    this.loginService.isUserAuthenticated$
      .pipe(
        tap(
          (isUserAuthenticated) =>
            (this.isUserAuthenticated = isUserAuthenticated)
        )
      )
      .subscribe();

    this.loginService.isUserAuthenticated$
      .pipe(
        filter((isUserAuthenticated) => isUserAuthenticated),
        take(1),
        mergeMap(() => {
          const { tenantId } = this.tenantService.getTenantInfo();
          return combineLatest([
            this.usersService.getLoggedInUser$().pipe(
              tap((userInfo) => {
                if (Object.keys(userInfo).length) {
                  this.loginService.setLoggedInUserInfo(userInfo);
                }
              })
            ),
            this.tenantService.getTenantLogoByTenantId$(tenantId).pipe(
              tap(({ tenantLogo }) =>
                this.tenantService.setTenantInfo({
                  tenantLogo: tenantLogo
                    ? this.imageUtils.getImageSrc(
                        Buffer.from(tenantLogo).toString()
                      )
                    : tenantLogo
                } as Tenant)
              )
            )
          ]);
        })
      )
      .subscribe(([userInfo]) => {
        if (Object.keys(userInfo).length) {
          this.registerServerSentEvents(userInfo, ref);
        }
      });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRouteUrl = event.urlAfterRedirects;
        const splitedUrl = '/' + this.currentRouteUrl.split('/')[1];
        const selectedmenu = this.menus.find((x) => x.url === splitedUrl);
        this.selectedMenu = selectedmenu?.title;
        this.commonService.setCurrentRouteUrl(this.currentRouteUrl);
        //this.menus = this.toggleSubMenu(this.menus, this.currentRouteUrl);
      });

    this.translateService.use(defaultLanguage);
    this.commonService.setTranslateLanguage(defaultLanguage);

    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      filter((userInfo) => userInfo && Object.keys(userInfo).length !== 0)
    );

    this.commonService.displayPermissionRevoke$.subscribe((display) => {
      if (display && !this.commonService.getPermisionRevokeModalStatus()) {
        this.commonService.setPermisionRevokeModalStatus(true);
        const dialogRef = this.dialog.open(
          PermissionsRevokeInfoModalComponent,
          {
            disableClose: true
          }
        );
        dialogRef.afterClosed().subscribe(() => {
          this.commonService.setPermisionRevokeModalStatus(false);
        });
      }
    });

    this.displayLoader$ = this.commonService.displayLoader$.pipe(
      tap((display) => (this.displayLoader = display))
    );
  }

  registerServerSentEvents(userInfo, ref) {
    let userID;
    if (userInfo.collaborationType === 'slack') {
      if (userInfo.slackDetail && userInfo.slackDetail.slackID) {
        userID = userInfo.slackDetail.slackID;
      }
    } else if (userInfo.collaborationType === 'msteams') {
      userID = userInfo.email;
    }

    // COLLABORATION CHAT SSE
    if (userID) {
      const collaborationSSEUrl = `${environment.userRoleManagementApiUrl}${userInfo.collaborationType}/sse/${userID}`;
      this.eventSourceCollaboration = this.sseService.getEventSourceWithGet(
        collaborationSSEUrl,
        null
      );
      this.eventSourceCollaboration.stream();
      this.eventSourceCollaboration.onmessage = (event) => {
        if (event) {
          const eventData = JSON.parse(event.data);
          if (!eventData.isHeartbeat) {
            eventData.forEach((evt: any) => {
              const { message } = evt;
              if (
                message.eventType === 'message' ||
                message.messageType === 'message' ||
                message.eventType === 'GROUP_CREATED_EVENT' ||
                message.messageType === 'GROUP_CREATED_EVENT'
              ) {
                const collaborationWindowStatus =
                  ref.chatService.getCollaborationWindowStatus();
                if (collaborationWindowStatus.isOpen) {
                  ref.chatService.newMessageReceived(message);
                } else {
                  let unreadCount = ref.chatService.getUnreadMessageCount();
                  unreadCount = unreadCount + 1;
                  ref.chatService.setUnreadMessageCount(unreadCount);
                }
                const audio = new Audio('../assets/audio/notification.mp3');
                audio.play();
              }
            });
          }
        }
      };
      this.eventSourceCollaboration.onerror = (event) => {
        // console.log(event);
      };
    }

    // JITSI AV CALLING SSE
    const jitsiSseUrl = `${environment.userRoleManagementApiUrl}jitsi/sse/${userInfo.email}`;
    this.eventSourceJitsi = this.sseService.getEventSourceWithGet(
      jitsiSseUrl,
      null
    );
    this.eventSourceJitsi.stream();
    this.eventSourceJitsi.onmessage = (event) => {
      if (event) {
        const eventData = JSON.parse(event.data);
        if (!eventData.isHeartbeat) {
          if (eventData.eventType === 'INCOMING_CALL') {
            // If any other AV call is going on, discard the SSE event, else delete the SSE event...
            const avConfWindowStatus = this.chatService.getAVConfWindowStatus();
            const acceptCallWindowStatus =
              this.chatService.getAcceptCallWindowStatus();
            const isAVConfWindowOpen = avConfWindowStatus.isOpen;
            const isAcceptCallWindowOpen = acceptCallWindowStatus.isOpen;
            if (isAVConfWindowOpen || isAcceptCallWindowOpen) {
              // TODO: If the call is not accepted for 10 consecutive SSE events, reject it gracefully with reason 'USER_BUSY_IN_OTHER_CALL'
              return;
            } else {
              this.chatService.deleteJitsiEvent$(eventData.id).subscribe();
              this.chatService.setMeeting(eventData);
            }
          } else if (eventData.eventType === 'END_CONFERENCE') {
            this.chatService.deleteJitsiEvent$(eventData.id).subscribe();
            this.chatService.endMeeting(eventData);
          }
        }
      }
    };
    this.eventSourceJitsi.onerror = (event) => {
      // console.log(event);
    };

    // USER PRESENCE SSE
    const updateUserPresenceSSEURL = `${environment.userRoleManagementApiUrl}users/sse/users_presence`;
    this.eventSourceUpdateUserPresence = this.sseService.getEventSourceWithGet(
      updateUserPresenceSSEURL,
      null
    );
    this.eventSourceUpdateUserPresence.stream();
    this.eventSourceUpdateUserPresence.onmessage = (event) => {
      if (event) {
        const eventData = JSON.parse(event.data);
        if (!eventData.isHeartbeat) {
          this.peopleService.updateUserPresence({
            action: 'update_user_presence',
            data: eventData
          });
        }
      }
    };
    this.eventSourceUpdateUserPresence.onerror = (event) => {
      // console.log(event);
    };
  }

  ngAfterViewChecked(): void {
    this.cdrf.detectChanges();
  }

  sidebarMouseenter(e) {
    if (this.layoutConf.sidebarStyle === 'compact') {
      this.layout.publishLayoutChange(
        { sidebarStyle: 'full' },
        { transitionClass: true }
      );
    }
  }

  selectedListElement(title) {
    this.selectedMenu = title;
  }

  sidebarMouseleave(e) {
    if (
      this.layoutConf.sidebarStyle === 'full' &&
      this.layoutConf.sidebarCompactToggle
    ) {
      this.layout.publishLayoutChange(
        { sidebarStyle: 'compact' },
        { transitionClass: true }
      );
    }
  }

  updateAdminContainerClasses(layoutConf) {
    if (layoutConf.sidebarStyle === 'full') {
      this.subMenuShow = true;
    } else {
      this.subMenuShow = false;
    }
    return {
      'sidebar-full': layoutConf.sidebarStyle === 'full',
      'sidebar-compact':
        layoutConf.sidebarStyle === 'compact' &&
        layoutConf.navigationPos === 'side',
      'compact-toggle-active': layoutConf.sidebarCompactToggle
    };
  }

  ngOnDestroy() {
    if (this.layoutConfSub) {
      this.layoutConfSub.unsubscribe();
    }
    if (this.routerEventSub) {
      this.routerEventSub.unsubscribe();
    }
  }
}
