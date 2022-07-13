import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { CommonService } from './shared/services/common.service';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter, mergeMap, take, tap } from 'rxjs/operators';
import {
  defaultLanguage,
  routingUrls,
  permissions as perms
} from './app.constants';
import { TranslateService } from '@ngx-translate/core';
import { OidcSecurityService, UserDataResult } from 'angular-auth-oidc-client';
import { UsersService } from './components/user-management/services/users.service';
import { combineLatest, Observable } from 'rxjs';
import { Permission, Tenant } from './interfaces';
import { LoginService } from './components/login/services/login.service';
import { HeaderService } from './shared/services/header.service';
import { environment } from 'src/environments/environment';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { ChatService } from './shared/components/collaboration/chats/chat.service';
import { AuthHeaderService } from './shared/services/authHeader.service';
import { TenantService } from './components/tenant-management/services/tenant.service';
import { ImageUtils } from './shared/utils/imageUtils';
import { Buffer } from 'buffer';

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
  opened = false;
  menus = [
    {
      title: dashboard.title,
      url: dashboard.url,
      activeImage: 'assets/sidebar-icons/dashboard-white.svg',
      image: 'assets/sidebar-icons/dashboard-gray.svg',
      showSubMenu: false,
      permission: perms.viewDashboards,
      subPages: [
        {
          title: reports.title,
          url: reports.url,
          permission: perms.viewReports
        }
      ],
      disable: false
    },
    {
      title: tenantManagement.title,
      url: tenantManagement.url,
      activeImage: 'assets/sidebar-icons/tenant-management-white.svg',
      image: 'assets/sidebar-icons/tenant-management-gray.svg',
      showSubMenu: false,
      permission: perms.viewTenants,
      subPages: null,
      disable: false
    },
    {
      title: userManagement.title,
      url: userManagement.url,
      activeImage: 'assets/sidebar-icons/user-management-white.svg',
      image: 'assets/sidebar-icons/user-management-gray.svg',
      showSubMenu: false,
      permission: perms.viewUsers,
      subPages: [
        {
          title: rolesPermissions.title,
          url: rolesPermissions.url,
          permission: perms.viewRoles
        },
        {
          title: inActiveUsers.title,
          url: inActiveUsers.url,
          permission: perms.viewInactiveUsers
        }
      ],
      disable: false
    },
    {
      title: maintenance.title,
      url: maintenance.url,
      activeImage: 'assets/sidebar-icons/maintenance-white.svg',
      image: 'assets/sidebar-icons/maintenance-gray.svg',
      showSubMenu: false,
      permission: perms.viewMaintenanceControlCenter,
      subPages: null,
      disable: false
    },
    {
      title: spareParts.title,
      url: spareParts.url,
      activeImage: 'assets/sidebar-icons/spare-parts-white.svg',
      image: 'assets/sidebar-icons/spare-parts-gray.svg',
      showSubMenu: false,
      permission: perms.viewSparePartsControlCenter,
      subPages: null,
      disable: false
    },
    {
      title: workInstructions.title,
      url: workInstructions.url,
      activeImage: 'assets/sidebar-icons/work-instructions-white.svg',
      image: 'assets/sidebar-icons/work-instructions-gray.svg',
      showSubMenu: false,
      permission: perms.viewWorkInstructions,
      subPages: [
        {
          title: favorites.title,
          url: favorites.url,
          permission: perms.viewWorkInstructions
        },
        {
          title: drafts.title,
          url: drafts.url,
          permission: perms.viewWorkInstructions
        },
        {
          title: published.title,
          url: published.url,
          permission: perms.viewWorkInstructions
        },
        {
          title: recents.title,
          url: recents.url,
          permission: perms.viewWorkInstructions
        },
        {
          title: files.title,
          url: files.url,
          permission: perms.viewFiles
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
  permissions$: Observable<Permission[]>;
  menuHasSubMenu = {};
  isNavigated = false;
  isUserAuthenticated = false;

  constructor(
    private commonService: CommonService,
    private router: Router,
    private cdrf: ChangeDetectorRef,
    private translateService: TranslateService,
    private oidcSecurityService: OidcSecurityService,
    private usersService: UsersService,
    private loginService: LoginService,
    private authHeaderService: AuthHeaderService,
    private chatService: ChatService,
    private headerService: HeaderService,
    private tenantService: TenantService,
    private imageUtils: ImageUtils
  ) {}

  ngOnInit() {
    const ref = this;
    this.loginService.isUserAuthenticated$
      .pipe(
        tap(
          (isUserAuthenticated) =>
            (this.isUserAuthenticated = isUserAuthenticated)
        ),
        filter((isUserAuthenticated) => isUserAuthenticated),
        take(1),
        mergeMap(() => {
          const { tenantId } = this.tenantService.getTenantInfo();
          return combineLatest([
            this.usersService.getLoggedInUser$(),
            this.headerService.getTenantLogoByTenantId$(tenantId)
          ]);
        })
      )
      .subscribe(([data, { tenantLogo }]) => {
        this.tenantService.setTenantInfo({
          tenantLogo: this.imageUtils.getImageSrc(
            Buffer.from(tenantLogo).toString()
          )
        } as Tenant);
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

    this.oidcSecurityService.userData$
      .pipe(
        take(2),
        filter((user) => user.allUserData.length !== 0),
        mergeMap((res: UserDataResult) => {
          const {
            userData: { email }
          } = res.allUserData.find(({ userData }) => userData);
          return this.usersService
            .getUserPermissionsByEmail$(email)
            .pipe(
              tap((permissions) =>
                this.commonService.setPermissions(permissions)
              )
            );
        })
      )
      .subscribe();

    this.permissions$ = this.commonService.permissionsAction$;

    combineLatest([
      this.commonService.permissionsAction$.pipe(
        filter((permissions) => permissions.length !== 0)
      ),
      this.router.events.pipe(
        filter((event) => event instanceof NavigationStart)
      )
    ])
      .pipe(
        tap(([permissions, event]: [Permission[], NavigationStart]) => {
          const returnUrl = sessionStorage.getItem('returnUrl');
          if (returnUrl) {
            sessionStorage.removeItem('returnUrl');
            this.router.navigate([returnUrl]);
          } else if (event.url === '/') {
            this.navigateToModule(
              permissions,
              perms.viewDashboards,
              'dashboards'
            );
            this.navigateToModule(
              permissions,
              perms.viewTenants,
              'tenant-management'
            );
            this.navigateToModule(
              permissions,
              perms.viewMaintenanceControlCenter,
              'maintenance'
            );
            this.navigateToModule(
              permissions,
              perms.viewSparePartsControlCenter,
              'spare-parts'
            );
            this.navigateToModule(
              permissions,
              perms.viewUsers,
              'user-management'
            );
            this.navigateToModule(
              permissions,
              perms.viewWorkInstructions,
              'work-instructions'
            );
          }
        })
      )
      .subscribe();
  }

  ngAfterViewChecked(): void {
    this.sidebar = this.opened;
    this.cdrf.detectChanges();
  }

  getImage = (image, activeImage, active) =>
    active === true ? activeImage : image;

  selectedListElement(title) {
    this.selectedMenu = title;
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
      permissions.length &&
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

  navigateToModule(
    permissions: Permission[],
    permission: string,
    routePath: string
  ) {
    if (!this.isNavigated && permissions.length) {
      const found = permissions.find((perm) => perm.name === permission);
      if (found) {
        if (permission !== perms.viewDashboards) {
          this.router.navigate([routePath]);
        }
        this.isNavigated = true;
      }
    }
  }
}
