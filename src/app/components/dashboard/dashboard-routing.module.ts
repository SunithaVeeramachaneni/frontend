import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardContainerComponent } from './dashboard-container/dashboard-container.component';

import { ReportConfigurationComponent } from './report-configuration/report-configuration.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardContainerComponent,
    data: { breadcrumb: { label: 'Dashboard' } },
    children: [
      {
        path: 'reports',
        component: ReportsComponent,
        data: { breadcrumb: { label: 'Reports' } },
        children: [
          {
            path: 'addreport',
            component: ReportConfigurationComponent,
            data: {
              breadcrumb: { label: 'Add Report', alias: 'reportConfiguration' }
            }
          },
          {
            path: 'editreport/:id',
            component: ReportConfigurationComponent,
            data: {
              breadcrumb: { label: 'Edit Report', alias: 'reportConfiguration' }
            }
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
