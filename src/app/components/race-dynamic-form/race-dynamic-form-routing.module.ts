import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { permissions } from 'src/app/app.constants';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { FormResolverService } from '../race-dynamic-form/services/form-resolver.service';
import { FormContainerComponent } from './form-container/form-container.component';
import { ArchivedListComponent } from './archived-list/archived-list.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { TemplateResolverService } from './services/template-resolver.service';
import { TemplateContainerComponent } from './template-container/template-container.component';
import { InspectionObservationsComponent } from './inspection-observations/inspection-observations.component';
import { FormEditViewComponent } from './form-modal/form-edit-view.component';
import { TemplateModalComponent } from './template-modal/template-modal.component';

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
        component: FormContainerComponent,
        canActivate: [AuthGuard],
        resolve: { form: FormResolverService },
        data: {
          permissions: [permissions.createForm]
        }
      },
      {
        path: 'edit/:id',
        component: FormEditViewComponent,
        canActivate: [AuthGuard],
        resolve: { form: FormResolverService },
        data: {
          permissions: [permissions.updateForm]
        }
      },
      {
        path: 'archived/:tabIndex',
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
            component: TemplateModalComponent,
            resolve: { form: TemplateResolverService },
            canActivate: [AuthGuard],
            data: {
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
