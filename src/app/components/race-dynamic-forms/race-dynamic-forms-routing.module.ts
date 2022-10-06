import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { permissions } from 'src/app/app.constants';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';

import { RaceDynamicFormsContainerComponent } from './race-dynamic-forms-container/race-dynamic-forms-container.component';
import { CreateFormComponent } from './create-form/create-form.component';

const routes: Routes = [
  {
    path: '',
    component: RaceDynamicFormsContainerComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: { label: 'Race Dynamic Forms' },
      permissions: [permissions.viewForms]
    },
    children: [
      {
        path: 'create',
        component: CreateFormComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Untitled Form', alias: 'formName' },
          permissions: [permissions.createForm]
        }
      },
      {
        path: 'edit/:id',
        component: CreateFormComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Edit Form', alias: 'formName' },
          permissions: [permissions.updateForm]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), ReactiveFormsModule],
  exports: [RouterModule]
})
export class RaceDynamicFormsRoutingModule {}
