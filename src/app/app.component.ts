import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonService } from './shared/services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  public logo = '../assets/img/svg/innov-logo.svg';
  public smallLogo = '../assets/img/svg/innov-small-logo.svg';
  appPages = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'home',
      showDetails: false,
      subPages: null
    },
    {
      title: 'Maintenance Control Center',
      url: '/maintenance',
      icon: 'grid',
      showDetails: false,
      subPages: null
    },
    {
      title: 'Spare Parts Control Center',
      url: '/spare-parts',
      icon: 'grid',
      showDetails: false,
      subPages: null
    },
    {
      title: 'Work Instructions Authoring',
      url: '/work-instructions',
      icon: 'pencil',
      showDetails: false,
      subPages: [
        { title: 'Favorites', url:'/work-instructions/favorites', icon: '' },
        { title: 'Drafts', url:'/work-instructions/drafts', icon: '' },
        { title: 'Published', url:'/work-instructions/published', icon: '' },
        { title: 'Recents', url:'/work-instructions/recents', icon: '' }
      ]
    },
  ];
  loggedIn = false;
  dark = false;
  sidebar;

  constructor(private commonService: CommonService) {}

  ngOnInit() {
    this.commonService.minimizeSidebarAction$.subscribe(data => {
      this.sidebar = data;
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

  toggleDetails(p) {
    if (p.showDetails) {
      p.showDetails = false;
    } else {
      p.showDetails = true;
    }
  }

}
