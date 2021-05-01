import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Dashboard', url: 'Dashboard', icon: 'home' },
    { title: 'Insights', url: 'Insights', icon: 'star' },
    { title: 'ROI Forecasting', url: '/components/ROIForecasting', icon: 'person' },
    { title: 'Chatter', url: '/components/Chatter', icon: 'chatbubbles' },
    { title: 'IOT and Alerts', url: '/components/IOTandAlerts', icon: 'notifications' },
    { title: 'Maintenance Control Center', url: '/components/MaintenanceControlCenter', icon: 'journal' },
    { title: 'Planning & Scheduling', url: '/components/PlanningandScheduling', icon: 'calendar' },
    { title: 'Work Instructions Authoring', url: 'WorkInstructions-Home', icon: 'create' },
    { title: 'Operator Rounds', url: '/components/OperatorRounds', icon: 'radio-button-off' },
    { title: 'Paperless Operations', url: '/components/PaperlessOperations', icon: 'square' },
    { title: 'Asset Tracker', url: '/components/AssetTracker', icon: 'navigate' },
    { title: 'Warehouse 360°', url: '/components/Warehouse360°', icon: 'settings' },
    { title: 'Configure CWP', url: '/components/ConfigureCWP', icon: 'settings' },

  ];
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}

  ngOnInit(): void {
    const userDetails = {
      "id": "1",
      "first_name": "Sunitha",
      "last_name": "Veeramachaneni",
      "email": "sunitha.veermchanneu@innovapptve.com",
      "password": 'x123',
      "role": "admin",
      "empId": "5000343"
    };
    localStorage.setItem('loggedInUser', JSON.stringify(userDetails));
  }
}
