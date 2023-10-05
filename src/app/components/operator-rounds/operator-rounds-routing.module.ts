import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { permissions } from 'src/app/app.constants';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';

import { ArchivedListComponent } from './archived-list/archived-list.component';
import { OperatorRoundsContainerComponent } from './operator-rounds-container/operator-rounds-container.component';
import { RoundPlanResolverService } from './services/round-plan-resolver.service';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { RoundObservationsComponent } from './round-observations/round-observations.component';
import { RoundPlanEditViewComponent } from './round-plan-modal/round-plan-edit-view.component';
import { OperatorRoundsDashboardComponent } from './operator-rounds-dashboard/operator-rounds-dashboard.component';
import { ReportsComponent } from '../dashboard/reports/reports.component';
import { ReportConfigurationComponent } from '../dashboard/report-configuration/report-configuration.component';

const routes: Routes = [
  {
    path: '',
    component: OperatorRoundsContainerComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: { label: 'Operator Rounds' },
      permissions: [permissions.viewORPlans]
    },
    children: [
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Reports' },
          permissions: [permissions.viewOPRReports]
        },
        children: [
          {
            path: 'addreport',
            component: ReportConfigurationComponent,
            canActivate: [AuthGuard],
            data: {
              breadcrumb: { label: 'Add Report', alias: 'reportConfiguration' },
              permissions: [permissions.createOPRReport]
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
              permissions: [permissions.updateOPRReport]
            }
          }
        ]
      },
      {
        path: 'dashboard',
        component: OperatorRoundsDashboardComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Dashboard' },
          permissions: [permissions.viewOPRDashboards]
        }
      },
      {
        path: 'round-plans',
        component: OperatorRoundsContainerComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Operator Rounds' },
          permissions: [permissions.viewORPlans]
        }
      },
      {
        path: 'round-plans/create',
        component: OperatorRoundsContainerComponent,
        canActivate: [AuthGuard],
        resolve: { form: RoundPlanResolverService },
        data: {
          permissions: [permissions.createORPlan],
          componentMode: 'create'
        }
      },
      {
        path: 'round-plans/edit/:id',
        component: RoundPlanEditViewComponent,
        canActivate: [AuthGuard],
        resolve: { form: RoundPlanResolverService },
        data: {
          permissions: [permissions.updateORPlan],
          componentMode: 'edit'
        }
      },
      {
        path: 'scheduler/:tabIndex',
        component: SchedulerComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Scheduler' },
          permissions: [permissions.viewScheduler]
        }
      },
      {
        path: 'archived',
        component: ArchivedListComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Archived', alias: 'formName' },
          permissions: [permissions.viewArchivedORP]
        }
      },
      {
        path: 'observations',
        component: RoundObservationsComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Observations' },
          permissions: [permissions.viewORObservations]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperatorRoundsRoutingModule {}
