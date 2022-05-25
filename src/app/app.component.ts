import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { CommonService } from './shared/services/common.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { defaultLanguage, routingUrls } from './app.constants';
import { TranslateService } from '@ngx-translate/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { UsersService } from './components/user-management/services/users.service';
import { Observable, of } from 'rxjs';
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
  inActiveUsers,
  tenantManagement
  //inActiveTenants
} = routingUrls;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
  menus = [
    {
      title: dashboard.title,
      url: dashboard.url,
      image: '../assets/sidebar-icons/dashboard-gray.svg',
      showSubMenu: false,
      permission: 'VIEW_DASHBOARDS',
      subPages: [
        { title: reports.title, url: reports.url, permission: 'VIEW_REPORTS' }
      ],
      disable: false
    },
    {
      title: tenantManagement.title,
      url: tenantManagement.url,
      image: 'assets/sidebar-icons/user-management.svg',
      showSubMenu: false,
      permission: 'VIEW_TENANTS',
      subPages: [],
      disable: false
    },
    {
      title: maintenance.title,
      url: maintenance.url,
      image: '../assets/sidebar-icons/maintenance-gray.svg',
      showSubMenu: false,
      permission: 'VIEW_MAINTENANCE_CONTROL_CENTER',
      subPages: null,
      disable: false
    },
    {
      title: spareParts.title,
      url: spareParts.url,
      image: '../assets/sidebar-icons/spare-parts-gray.svg',
      showSubMenu: false,
      permission: 'VIEW_SPARE_PARTS_CONTROL_CENTER',
      subPages: null,
      disable: false
    },
    {
      title: userManagement.title,
      url: userManagement.url,
      image: '../assets/sidebar-icons/user-management.svg',
      showSubMenu: false,
      permission: 'VIEW_USERS',
      subPages: [
        {
          title: rolesPermissions.title,
          url: rolesPermissions.url,
          permission: 'VIEW_ROLES'
        },
        {
          title: inActiveUsers.title,
          url: inActiveUsers.url,
          permission: 'VIEW_INACTIVE_USERS'
        }
      ],
      disable: false
    },
    {
      title: workInstructions.title,
      url: workInstructions.url,
      image: '../assets/sidebar-icons/work-instructions-gray.svg',
      showSubMenu: false,
      permission: 'VIEW_WORK_INSTRUCTIONS',
      subPages: [
        {
          title: favorites.title,
          url: favorites.url,
          permission: 'VIEW_WORK_INSTRUCTIONS'
        },
        {
          title: drafts.title,
          url: drafts.url,
          permission: 'VIEW_WORK_INSTRUCTIONS'
        },
        {
          title: published.title,
          url: published.url,
          permission: 'VIEW_WORK_INSTRUCTIONS'
        },
        {
          title: recents.title,
          url: recents.url,
          permission: 'VIEW_WORK_INSTRUCTIONS'
        },
        { title: files.title, url: files.url, permission: 'VIEW_FILES' }
      ],
      disable: false
    }
  ];
  loggedIn = false;
  dark = false;
  sidebar: boolean;
  currentRouteUrl: string;
  selectedMenu: string;
  permissions$: Observable<Permission[]>;
  menuHasSubMenu = {};

  constructor(
    private commonService: CommonService,
    private router: Router,
    private cdrf: ChangeDetectorRef,
    private translateService: TranslateService,
    private oidcSecurityService: OidcSecurityService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
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
}
