import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginErrorComponent } from './login-error/login-error.component';
import { LoginComponent } from './login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'inactive',
    component: LoginErrorComponent,
    data: {
      breadcrumb: { skip: true }
    }
  },
  {
    path: 'unknown',
    component: LoginErrorComponent,
    data: {
      breadcrumb: { skip: true }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {}
