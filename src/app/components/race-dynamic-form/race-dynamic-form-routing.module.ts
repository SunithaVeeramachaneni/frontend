import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { permissions } from 'src/app/app.constants';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { FormConfigurationComponent } from './form-configuration/form-configuration.component';

import { FormContainerComponent } from './form-container/form-container.component';
import { SubmissionViewComponent } from './submission-view/submission-view.component';

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
        path: 'view',
        component: SubmissionViewComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'View Form', alias: 'formName' },
          permissions: [permissions.viewForms]
        }
      },
      {
        path: 'edit/:id',
        component: FormConfigurationComponent,
        canActivate: [AuthGuard],
        // resolve: { form: FormResolverService },
        data: {
          breadcrumb: { label: 'Edit Form', alias: 'formName' },
          permissions: [permissions.updateForm]
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
