import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { permissions } from 'src/app/app.constants';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { DashboardContainerComponent } from './dashboard-container/dashboard-container.component';

import { ReportConfigurationComponent } from './report-configuration/report-configuration.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardContainerComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: { label: 'Dashboard' },
      permissions: [permissions.viewDashboards]
    },
    children: [
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Reports' },
          permissions: [permissions.viewReports]
        },
        children: [
          {
            path: 'addreport',
            component: ReportConfigurationComponent,
            canActivate: [AuthGuard],
            data: {
              breadcrumb: { label: 'Add Report', alias: 'reportConfiguration' },
              permissions: [permissions.createReport]
            }
          },
          {
            path: 'editreport/:id',
            component: ReportConfigurationComponent,
            canActivate: [AuthGuard],
            data: {
              breadcrumb: {
                label: 'Edit Report',
                alias: 'reportConfiguration'
              },
              permissions: [permissions.updateReport]
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
