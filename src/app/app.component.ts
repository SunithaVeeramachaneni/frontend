import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
export class AppComponent implements OnInit {
  public logo = "../assets/img/svg/innov-logo.svg";
  public smallLogo = "../assets/img/svg/innov-small-logo.svg";

  menus = [
    {
      title: dashboard.title,
      url: dashboard.url,
      icon: 'home',
      showSubMenu: false,
      subPages: null
    },
    {
      title: maintenance.title,
      url: maintenance.url,
      icon: 'view_column',
      showSubMenu: false,
      subPages: null
    },
    {
      title: spareParts.title,
      url: spareParts.url,
      icon: 'view_column',
      showSubMenu: false,
      subPages: null
    },
    {
      title: workInstructions.title,
      url: workInstructions.url,
      icon: 'format_list_numbered',
      showSubMenu: false,
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
              private router: Router) { }

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
        this.commonService.updateCurrentRouteUrl(this.currentRouteUrl);
        this.menus = this.toggleSubMenu(this.menus, this.currentRouteUrl, this.sidebar);
    });

    const userDetails = {
      id: '1',
      first_name: 'Sunitha',
      last_name: 'Veeramachaneni',
      email: 'sunitha.veermchanneu@innovapptve.com',
      password: 'x123',
      role: 'admin',
      empId: '5000343'
    };
    localStorage.setItem('loggedInUser', JSON.stringify(userDetails));
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
