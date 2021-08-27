import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonService } from './shared/service/common.service';
import { Router ,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  public logo = "../assets/img/svg/innov-logo.svg";
  public smallLogo = "../assets/img/svg/innov-small-logo.svg";
  appPages = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'home',
      showSubMenu: false,
      subPages: null
    },
    {
      title: 'Maintenance Control Center',
      url: '/maintenance',
      icon: 'grid',
      showSubMenu: false,
      subPages: null
    },
    {
      title: 'Spare Parts Control Center',
      url: '/spare-parts',
      icon: 'grid',
      showSubMenu: false,
      subPages: null
    },
    {
      title: 'Work Instructions Authoring',
      url: '/workinstructions',
      icon: 'pencil',
      showSubMenu: false,
      subPages: [
        { title: 'Favorites', url:'/favorites' },
        { title: 'Drafts', url:'/workinstructions/drafts' },
        { title: 'Published', url:'/published' },
        { title: 'Recents', url:'/recents' }
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
      console.log(data);
      this.sidebar = data;
      if(this.currentRouteUrl) {
        this.appPages = this.toggleSubMenu(this.appPages, this.currentRouteUrl, this.sidebar);
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(
      (event: NavigationEnd)  => {
        this.currentRouteUrl = event.url;
        this.appPages = this.toggleSubMenu(this.appPages, this.currentRouteUrl, this.sidebar);
    });
  }

  toggleSubMenu(appPages: any, currentRouteUrl: string, sidebarMinimized: boolean) {
    return appPages.map(menuItem => {
      let showSubMenu = false;
      if (menuItem.subPages !== null && !sidebarMinimized && currentRouteUrl.indexOf(menuItem.url) === 0) {
        showSubMenu = true;
      }
     return { ...menuItem, showSubMenu };
   });
  }
}
