import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { filter } from 'rxjs/operators';
import { bigInnovaIcon, smallInnovaIcon } from '../../../app.constants';
import { ILayoutConf, LayoutService } from '../../services/layout.service';
import { Permission, UserInfo } from '../../../interfaces';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/components/login/services/login.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() currentRoute;
  @Input() selectedMenu;
  @Input() menus;
  @Input() subMenuShow;
  @Output() selectedMenuElement = new EventEmitter<string>();
  public layoutConf: ILayoutConf;
  menuHasSubMenu = {};
  userInfo$: Observable<UserInfo>;
  bigInnovaIcon = bigInnovaIcon;
  smallInnovaIcon = smallInnovaIcon;

  constructor(
    private layout: LayoutService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.layoutConf = this.layout.layoutConf;

    this.menus = this.toggleSubMenu(this.menus, this.currentRoute);

    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      filter((userInfo) => userInfo && Object.keys(userInfo).length !== 0)
    );
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

  selectedListElement(title) {
    this.selectedMenuElement.emit(title);
  }

  getImage = (imageName: string, active: boolean) =>
    active
      ? `assets/sidebar-icons/${imageName}-white.svg`
      : `assets/sidebar-icons/${imageName}-gray.svg`;

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

  toggleCollapse() {
    if (this.layoutConf.sidebarCompactToggle) {
      this.layout.publishLayoutChange({
        sidebarCompactToggle: false
      });
    } else {
      this.layout.publishLayoutChange({
        // sidebarStyle: "compact",
        sidebarCompactToggle: true
      });
    }
  }
}
