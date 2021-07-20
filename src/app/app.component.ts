import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  public logo = "../assets/img/svg/innov-logo.svg";
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
      url: '/workinstructions',
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
      url: '/spareparts',
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

  constructor( ) {}

  async ngOnInit() {}

}
