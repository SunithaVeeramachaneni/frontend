import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonService } from './shared/services/common.service';
import { Router ,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { routingUrls } from './app.constants';

const {
  dashboard,
  spareParts,
  maintenance,
  workInstructions,
  drafts,
  favorites,
  recents,
  published,
  files
} = routingUrls;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewChecked {
  public logo = "../assets/img/svg/innov-logo.svg";
  public smallLogo = "../assets/img/svg/innov-small-logo.svg";

  menus = [
    {
      title: dashboard.title,
      url: dashboard.url,
      icon: 'home',
      showSubMenu: false,
      subPages: null,
      disable: true
    },
    {
      title: maintenance.title,
      url: maintenance.url,
      icon: 'view_column',
      showSubMenu: false,
      subPages: null,
      disable: false
    },
    {
      title: spareParts.title,
      url: spareParts.url,
      icon: 'view_column',
      showSubMenu: false,
      subPages: null,
      disable: false
    },
    {
      title: workInstructions.title,
      url: workInstructions.url,
      icon: 'format_list_numbered',
      showSubMenu: false,
      disable: false,
      subPages: [
        { title: favorites.title, url: favorites.url },
        { title: drafts.title, url: drafts.url },
        { title: published.title, url: published.url },
        { title: recents.title, url: recents.url },
        { title: files.title, url: files.url }
      ]
    },
  ];
  loggedIn = false;
  dark = false;
  sidebar: boolean;
  currentRouteUrl: string;

  constructor(private commonService: CommonService, 
              private router: Router,
              private cdrf: ChangeDetectorRef) { }

  ngOnInit() {
    this.commonService.minimizeSidebarAction$.subscribe(data => {
      this.sidebar = data;
      if(this.currentRouteUrl) {
        this.menus = this.toggleSubMenu(this.menus, this.currentRouteUrl, this.sidebar);
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(
      (event: NavigationEnd)  => {
        this.currentRouteUrl = event.url;
        this.commonService.setCurrentRouteUrl(this.currentRouteUrl);
        this.menus = this.toggleSubMenu(this.menus, this.currentRouteUrl, this.sidebar);
    });
  }

  ngAfterViewChecked(): void {
    this.cdrf.detectChanges();
  }

  toggleSubMenu(menus: any, currentRouteUrl: string, sidebarMinimized: boolean) {
    return menus.map(menuItem => {
      let showSubMenu = false;
      if (menuItem.subPages !== null && !sidebarMinimized && currentRouteUrl.indexOf(menuItem.url) === 0) {
        showSubMenu = true;
      }
     return { ...menuItem, showSubMenu };
   });
  }
}
