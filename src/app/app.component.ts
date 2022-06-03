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
import { ChatService } from './shared/components/collaboration/chats/chat.service';
import { environment } from './../environments/environment';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { UsersService } from './components/user-management/services/users.service';
import { combineLatest, Observable, of } from 'rxjs';
import { Permission } from './interfaces';

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
  //inActiveUsers,
  inActiveUsers,
  tenantManagement
  //inActiveTenants
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
      image: '../assets/sidebar-icons/dashboard-gray.svg',
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
      image: 'assets/sidebar-icons/user-management.svg',
      showSubMenu: false,
      permission: perms.viewTenants,
      subPages: [],
      disable: false
    },
    {
      title: maintenance.title,
      url: maintenance.url,
      image: '../assets/sidebar-icons/maintenance-gray.svg',
      showSubMenu: false,
      permission: perms.viewMaintenanceControlCenter,
      subPages: null,
      disable: false
    },
    {
      title: spareParts.title,
      url: spareParts.url,
      image: '../assets/sidebar-icons/spare-parts-gray.svg',
      showSubMenu: false,
      permission: perms.viewSparePartsControlCenter,
      subPages: null,
      disable: false
    },
    {
      title: userManagement.title,
      url: userManagement.url,
      image: '../assets/sidebar-icons/user-management.svg',
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
      title: workInstructions.title,
      url: workInstructions.url,
      image: '../assets/sidebar-icons/work-instructions-gray.svg',
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

  constructor(
    private commonService: CommonService,
    private router: Router,
    private cdrf: ChangeDetectorRef,
    private translateService: TranslateService,
    private chatService: ChatService,
    private oidcSecurityService: OidcSecurityService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.commonService.currentRouteUrlAction$.subscribe((currentRouteUrl) => {
      this.currentRouteUrl = currentRouteUrl;
    });
    const ref = this;
    this.oidcSecurityService.userData$
      .pipe(
        take(2),
        mergeMap((user) => {
          if (user.userData) {
            return this.usersService.getLoggedInUser$();
          } else {
            return of({});
          }
        })
      )
      .subscribe((data) => {
        if (data.UserSlackDetail && data.UserSlackDetail.slackID) {
          const userSlackDetail = data.UserSlackDetail;
          const { slackID } = userSlackDetail;

          this.eventSource = new EventSource(
            `${environment.slackAPIUrl}sse/${slackID}`
          );
          this.eventSource.onmessage = async (event: any) => {
            const eventData = JSON.parse(event.data);
            if (!eventData.isHeartbeat) {
              const processedMessageIds = [];
              eventData.forEach((evt: any) => {
                const { message } = evt;
                if (!message.isHeartbeat && message.eventType === 'message') {
                  processedMessageIds.push(evt.id);
                  // If collab window is not open, increment notification count...
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

    this.commonService.minimizeSidebarAction$.subscribe((data) => {
      this.sidebar = data;
      if (this.currentRouteUrl) {
        this.menus = this.toggleSubMenu(
          this.menus,
          this.currentRouteUrl,
          this.sidebar
        );
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
        this.menus = this.toggleSubMenu(
          this.menus,
          this.currentRouteUrl,
          this.sidebar
        );
      });

    this.translateService.use(defaultLanguage);
    this.commonService.setTranslateLanguage(defaultLanguage);

    this.oidcSecurityService.userData$
      .pipe(
        mergeMap((res) => {
          if (res.userData) {
            if (!this.commonService.getPermissions().length) {
              return this.usersService
                .getUserPermissionsByEmail$(res.userData.email)
                .pipe(
                  tap((permissions) =>
                    this.commonService.setPermissions(permissions)
                  )
                );
            } else {
              return of(null);
            }
          } else {
            return of(null);
          }
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
          if (event.url === '/') {
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
    this.cdrf.detectChanges();
  }

  selectedListElement(title) {
    this.selectedMenu = title;
  }

  toggleSubMenu(
    menus: any,
    currentRouteUrl: string,
    sidebarMinimized: boolean
  ) {
    return menus.map((menuItem) => {
      let showSubMenu = false;
      if (
        menuItem.subPages !== null &&
        !sidebarMinimized &&
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
      const subMenuPermission = subMenus.find((subMenu) =>
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
