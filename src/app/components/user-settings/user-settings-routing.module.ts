import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSettingsContainerComponent } from './user-settings-container/user-settings-container.component';

const routes: Routes = [
  {
    path: '',
    component: UserSettingsContainerComponent,
    data: { breadcrumb: { skip: true } }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSettingsRoutingModule {}
