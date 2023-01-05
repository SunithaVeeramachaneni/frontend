import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { permissions } from 'src/app/app.constants';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { FormConfigurationComponent } from './form-configuration/form-configuration.component';

import { FormContainerComponent } from './form-container/form-container.component';
import { SubmissionComponent } from './submission/submission.component';

const routes: Routes = [
  {
    path: '',
    component: FormContainerComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: { label: 'Race Dynamic Forms' },
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
        path: 'submissions',
        component: SubmissionComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Submissions', alias: 'formName' },
          permissions: [permissions.viewForms]
        }
      }
      // {
      //   path: 'edit/:id',
      //   component: CreateFormComponent,
      //   canActivate: [AuthGuard],
      //   resolve: { form: FormResolverService },
      //   data: {
      //     breadcrumb: { label: 'Edit Form', alias: 'formName' },
      //     permissions: [permissions.updateForm]
      //   }
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), ReactiveFormsModule],
  exports: [RouterModule]
})
export class RaceDynamicFormRoutingModule {}
