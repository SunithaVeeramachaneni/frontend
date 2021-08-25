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
      icon: 'home'
    },
    // {
    //   title: 'Insights',
    //   url: '/insights',
    //   icon: 'flash'
    // },
    {
      title: 'Maintenance Control Center',
      url: '/maintenance',
      icon: 'grid'
    },
    // {
    //   title: 'Chatter',
    //   url: '/chatter',
    //   icon: 'chatbox-ellipses'
    // },
    // {
    //   title: 'IOT and Alerts',
    //   url: '/iot',
    //   icon: 'notifications'
    // },
    // {
    //   title: 'Maintenance Planner',
    //   url: '/maintenance',
    //   icon: 'calendar'
    // },
    {
      title: 'Work Instructions Authoring',
      url: '/work-instructions',
      icon: 'pencil'
    },
    // {
    //   title: 'Operator Rounds',
    //   url: '/operator-rounds',
    //   icon: 'ellipse'
    // },
    // {
    //   title: 'Paperless Operations',
    //   url: '/paperless-operations',
    //   icon: 'square'
    // },
    // {
    //   title: 'Asset Tracker',
    //   url: '/asset-tracker',
    //   icon: 'triangle'
    // },
    {
      title: 'Spare Parts Control Center',
      url: '/spare-parts',
      icon: 'grid'
    },
    // {
    //   title: 'Configure CWP',
    //   url: '/configure',
    //   icon: 'settings'
    // },
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

}
