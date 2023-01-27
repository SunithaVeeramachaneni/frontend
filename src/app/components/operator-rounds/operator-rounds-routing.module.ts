import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { permissions } from 'src/app/app.constants';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';

import { SubmissionComponent } from '../race-dynamic-form/submission/submission.component';
import { SubmissionViewComponent } from '../race-dynamic-form/submission-view/submission-view.component';
import { ArchivedListComponent } from '../race-dynamic-form/archived-list/archived-list.component';
import { OperatorRoundsContainerComponent } from './operator-rounds-container/operator-rounds-container.component';
import { RoundPlanConfigurationComponent } from './round-plan-configuration/round-plan-configuration.component';
import { RoundPlanResolverService } from './services/round-plan-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: OperatorRoundsContainerComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: { label: 'Plans' },
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
        path: 'submissions',
        component: SubmissionComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Submissions', alias: 'formName' },
          permissions: [permissions.viewForms]
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperatorRoundsRoutingModule {}
