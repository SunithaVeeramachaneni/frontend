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
import { TemplateListComponent } from './template-list/template-list.component';
import { TemplateConfigurationComponent } from './template-configuration/template-configuration.component';
import { TemplateResolverService } from './services/template-resolver.service';

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
          permissions: [permissions.viewSubmissions]
        }
      },
      {
        path: 'archived',
        component: ArchivedListComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Archived', alias: 'formName' },
          permissions: [permissions.viewArchivedForms]
        }
      },
      {
        path: 'scheduler/:tabIndex',
        component: SchedulerComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Scheduler' },
          permissions: [permissions.viewFormScheduler]
        }
      },
      {
        path: 'templates',
        component: TemplateListComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Templates' },
          permissions: [permissions.viewFormTemplates]
        }
      },
      {
        path: 'templates/edit/:id',
        component: TemplateConfigurationComponent,
        resolve: { form: TemplateResolverService },
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Edit Template', alias: 'formName' },
          permissions: [permissions.updateFormTemplate]
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
