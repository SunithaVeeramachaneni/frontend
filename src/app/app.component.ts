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
import {
  defaultLanguage,
  routingUrls,
  bigInnovaIcon,
  smallInnovaIcon
} from './app.constants';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from './components/user-management/services/users.service';
import { combineLatest, Observable } from 'rxjs';
import { Permission, Tenant, UserInfo } from './interfaces';
import { LoginService } from './components/login/services/login.service';
import { environment } from 'src/environments/environment';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { ChatService } from './shared/components/collaboration/chats/chat.service';
import { AuthHeaderService } from './shared/services/authHeader.service';
import { TenantService } from './components/tenant-management/services/tenant.service';
import { ImageUtils } from './shared/utils/imageUtils';
import { Buffer } from 'buffer';
import { PermissionsRevokeInfoModalComponent } from './shared/components/permissions-revoke-info-modal/permissions-revoke-info-modal.component';
import { MatDialog } from '@angular/material/dialog';

import { UserIdleService } from 'angular-user-idle';
import { debounce } from './shared/utils/debounceMethod';

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
  bigInnovaIcon = bigInnovaIcon;
  smallInnovaIcon = smallInnovaIcon;
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
  loggedIn = false;
  dark = false;
  sidebar: boolean;
  currentRouteUrl: string;
  selectedMenu: string;
  eventSource: any;
  menuHasSubMenu = {};
  isNavigated = false;
  isUserAuthenticated = false;
  menuOpenClose = false;
  userInfo$: Observable<UserInfo>;
  displayLoader$: Observable<boolean>;
  displayLoader: boolean;

  isUserOnline = false;

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
    private imageUtils: ImageUtils,
    private dialog: MatDialog,
    private userIdle: UserIdleService
  ) {}

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

  updateUserPresence = () => {
    if (this.isUserOnline) return;
    this.usersService.setUserPresence$().subscribe((resp) => {
      this.userIdle.startWatching();
      this.isUserOnline = true;
      const userInfo = this.loginService.getLoggedInUserInfo();
      userInfo.online = true;
      // this.loginService.setLoggedInUserInfo(userInfo);
    });
  };

  ngOnInit() {
    //Start watching for user inactivity.
    this.userIdle.startWatching();
    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe((count) => {
      if (count === 1) {
        this.usersService.removeUserPresence$().subscribe((resp) => {
          this.isUserOnline = false;
          const userInfo = this.loginService.getLoggedInUserInfo();
          userInfo.online = false;
          // this.loginService.setLoggedInUserInfo(userInfo);
          this.userIdle.stopWatching();
        });
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
          let userID;
          if (userInfo.collaborationType === 'slack') {
            if (userInfo.slackDetail?.slackID) {
              userID = userInfo.slackDetail.slackID;
            }
          } else if (userInfo.collaborationType === 'msteams') {
            userID = userInfo.email;
          }

          const SSE_URL = `${environment.userRoleManagementApiUrl}${userInfo.collaborationType}/sse/${userID}`;

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
              eventData.forEach((evt: any) => {
                const { message } = evt;
                if (
                  message.eventType === 'message' ||
                  message.messageType === 'message'
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
          };
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
        this.menus = this.toggleSubMenu(this.menus, this.currentRouteUrl);
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

  ngAfterViewChecked(): void {
    this.cdrf.detectChanges();
  }

  getImage = (imageName: string, active: boolean) =>
    active
      ? `assets/sidebar-icons/${imageName}-white.svg`
      : `assets/sidebar-icons/${imageName}-gray.svg`;

  selectedListElement(title) {
    this.menuOpenClose = false;
    this.selectedMenu = title;
  }

  toggleMenu() {
    this.menuOpenClose = !this.menuOpenClose;
  }

  closeSideNav() {
    this.menuOpenClose = false;
  }

  toggleSubMenu(menus: any, currentRouteUrl: string) {
    return menus.map((menuItem) => {
      let showSubMenu = false;
      if (
        menuItem.subPages !== null &&
        currentRouteUrl.indexOf(menuItem.url) === 0
      ) {
        showSubMenu = true;
      }
      return { ...menuItem, showSubMenu };
    });
  }
  ngOnDestroy() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }

  checkUserHasSubMenusPermissions(
    permissions: Permission[],
    subMenus,
    menuPermission: string
  ) {
    if (
      permissions?.length &&
      this.menuHasSubMenu[menuPermission] === undefined
    ) {
      const subMenuPermission = subMenus?.find((subMenu) =>
        permissions.find((permission) => subMenu.permission === permission.name)
      );
      const hasPermission = subMenuPermission ? true : false;
      this.menuHasSubMenu[menuPermission] = hasPermission;
      return hasPermission;
    }
    return this.menuHasSubMenu[menuPermission];
  }
}
