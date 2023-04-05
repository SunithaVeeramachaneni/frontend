import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { permissions } from 'src/app/app.constants';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { FormResolverService } from '../race-dynamic-form/services/form-resolver.service';
import { FormConfigurationComponent } from './form-configuration/form-configuration.component';

import { FormContainerComponent } from './form-container/form-container.component';
import { SubmissionComponent } from './submission/submission.component';
import { ArchivedListComponent } from './archived-list/archived-list.component';
import { SchedulerComponent } from './scheduler/scheduler.component';

const routes: Routes = [
  {
    path: '',
    component: FormContainerComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: { label: 'Forms' },
      permissions: [permissions.viewForms]
    },
    children: [
      {
        path: 'create',
        component: FormConfigurationComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Untitled Form', alias: 'formName' },
          permissions: [permissions.createForm]
        }
      },
      {
        path: 'edit/:id',
        component: FormConfigurationComponent,
        canActivate: [AuthGuard],
        resolve: { form: FormResolverService },
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
        path: 'archived',
        component: ArchivedListComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Archived', alias: 'formName' },
          permissions: [permissions.viewForms]
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RaceDynamicFormRoutingModule {}
