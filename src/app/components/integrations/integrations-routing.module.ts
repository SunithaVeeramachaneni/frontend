import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { permissions } from 'src/app/app.constants';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { IntegrationsComponent } from './integrations/integrations.component';

const routes: Routes = [
  {
    path: '',
    component: IntegrationsComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: { label: 'Integrations Manager' },
      permissions: [permissions.viewDashboards]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationsRoutingModule {}
