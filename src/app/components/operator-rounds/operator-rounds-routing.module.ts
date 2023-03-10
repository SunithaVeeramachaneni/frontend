import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { permissions } from 'src/app/app.constants';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';

import { SubmissionComponent } from './submission/submission.component';
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
      permissions: [permissions.viewForms]
    },
    children: [
      {
        path: 'create',
        component: RoundPlanConfigurationComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Untitled Plan', alias: 'formName' },
          permissions: [permissions.createForm]
        }
      },
      {
        path: 'edit/:id',
        component: RoundPlanConfigurationComponent,
        canActivate: [AuthGuard],
        resolve: { form: RoundPlanResolverService },
        data: {
          breadcrumb: { label: 'Edit Form', alias: 'formName' },
          permissions: [permissions.updateForm]
        }
      },
      {
        path: 'scheduler/:tabIndex',
        component: SchedulerComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Scheduler' },
          permissions: [permissions.viewORPlans]
        }
      },
      {
        path: 'submissions/view/:id',
        component: SubmissionViewComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'View Form', alias: 'formName' },
          permissions: [permissions.viewForms]
        }
      },
      {
        path: 'archived',
        component: ArchivedListComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Archived', alias: 'formName' },
          permissions: [permissions.viewForms]
        }
      },
      {
        path: 'observations',
        component: ObservationsComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Observations' },
          permissions: [permissions.viewORPlans]
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
