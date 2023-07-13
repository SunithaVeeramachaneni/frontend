import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { permissions } from 'src/app/app.constants';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { FormResolverService } from '../race-dynamic-form/services/form-resolver.service';
import { FormConfigurationComponent } from './form-configuration/form-configuration.component';

import { FormContainerComponent } from './form-container/form-container.component';
import { ArchivedListComponent } from './archived-list/archived-list.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { TemplateConfigurationComponent } from './template-configuration/template-configuration.component';
import { TemplateResolverService } from './services/template-resolver.service';
import { TemplateContainerComponent } from './template-container/template-container.component';
import { InspectionObservationsComponent } from './inspection-observations/inspection-observations.component';

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
        resolve: { form: FormResolverService },
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
        component: TemplateContainerComponent,
        resolve: { form: TemplateResolverService },
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Templates' },
          permissions: [permissions.viewFormTemplates]
        },
        children: [
          {
            path: 'edit/:id',
            component: TemplateConfigurationComponent,
            resolve: { form: TemplateResolverService },
            canActivate: [AuthGuard],
            data: {
              breadcrumb: { label: 'Edit Template', alias: 'templateName' },
              permissions: [permissions.updateFormTemplate]
            }
          }
        ]
      },
      {
        path: 'observations',
        component: InspectionObservationsComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Observations' },
          permissions: [permissions.viewRdfObservations]
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
