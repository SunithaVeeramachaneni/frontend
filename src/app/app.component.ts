import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { CommonService } from './shared/services/common.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { defaultLanguage, routingUrls } from './app.constants';
import { TranslateService } from '@ngx-translate/core';
import { ChatService } from './shared/components/collaboration/chats/chat.service';
import { UsersService } from './components/user-management/users/users.service';
import { environment } from './../environments/environment';

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
      disable: false,
      subPages: [{ title: reports.title, url: reports.url }]
    },
    {
      title: tenantManagement.title,
      url: tenantManagement.url,
      image: 'assets/sidebar-icons/user-management.svg',
      showSubMenu: false,
      subPages: [],
      disable: false
    },
    {
      title: maintenance.title,
      url: maintenance.url,
      image: '../assets/sidebar-icons/maintenance-gray.svg',
      showSubMenu: false,
      subPages: null,
      disable: false
    },
    {
      title: spareParts.title,
      url: spareParts.url,
      image: '../assets/sidebar-icons/spare-parts-gray.svg',
      showSubMenu: false,
      subPages: null,
      disable: false
    },
    {
      title: userManagement.title,
      url: userManagement.url,
      image: '../assets/sidebar-icons/user-management.svg',
      showSubMenu: false,
      subPages: [
        { title: rolesPermissions.title, url: rolesPermissions.url }
        // { title: inActiveUsers.title, url: inActiveUsers.url }
      ],
      disable: false
    },
    {
      title: workInstructions.title,
      url: workInstructions.url,
      image: '../assets/sidebar-icons/work-instructions-gray.svg',
      showSubMenu: false,
      disable: false,
      subPages: [
        { title: favorites.title, url: favorites.url },
        { title: drafts.title, url: drafts.url },
        { title: published.title, url: published.url },
        { title: recents.title, url: recents.url },
        { title: files.title, url: files.url }
      ]
    }
  ];
  loggedIn = false;
  dark = false;
  sidebar: boolean;
  currentRouteUrl: string;
  selectedMenu: string;
  eventSource: any;

  constructor(
    private commonService: CommonService,
    private router: Router,
    private cdrf: ChangeDetectorRef,
    private translateService: TranslateService,
    private chatService: ChatService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    const ref = this;
    this.usersService.getLoggedInUser$().subscribe((data) => {
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
            ref.chatService.processSSEMessages$(processedMessageIds).subscribe(
              (response) => console.log(response),
              (err) => console.log(err)
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
}
