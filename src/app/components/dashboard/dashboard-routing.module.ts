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
  },
  {
    path: 'reports',
    component: ReportsComponent,
    data: { breadcrumb: { label: 'Reports' } },
  },
  {
    path: 'reports/addreport',
    component: ReportConfigurationComponent,
    data: { breadcrumb: { label: 'Reports' } }
  },
  {
    path: 'reports/editreport/:id',
    component: ReportConfigurationComponent,
    data: { breadcrumb: { label: 'Reports' } }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
