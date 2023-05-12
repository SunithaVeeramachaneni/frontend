import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { permissions } from 'src/app/app.constants';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';

import { SubmissionViewComponent } from './submission-view/submission-view.component';
import { ArchivedListComponent } from './archived-list/archived-list.component';
import { OperatorRoundsContainerComponent } from './operator-rounds-container/operator-rounds-container.component';
import { RoundPlanConfigurationComponent } from './round-plan-configuration/round-plan-configuration.component';
import { RoundPlanResolverService } from './services/round-plan-resolver.service';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { ObservationsComponent } from './observations/observations.component';

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
        path: 'create',
        component: RoundPlanConfigurationComponent,
        canActivate: [AuthGuard],
        resolve: { form: RoundPlanResolverService },
        data: {
          breadcrumb: { label: 'Untitled Plan', alias: 'formName' },
          permissions: [permissions.createORPlan],
          componentMode: 'create'
        }
      },
      {
        path: 'edit/:id',
        component: RoundPlanConfigurationComponent,
        canActivate: [AuthGuard],
        resolve: { form: RoundPlanResolverService },
        data: {
          breadcrumb: { label: 'Edit Round Plan', alias: 'formName' },
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
        path: 'submissions/view/:id',
        component: SubmissionViewComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'View Form', alias: 'formName' },
          permissions: [permissions.viewORPlans]
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
        component: ObservationsComponent,
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
