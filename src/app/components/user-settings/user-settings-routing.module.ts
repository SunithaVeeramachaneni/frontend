import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { UserSettingsContainerComponent } from './user-settings-container/user-settings-container.component';

const routes: Routes = [
  {
    path: '',
    component: UserSettingsContainerComponent,
    data: { breadcrumb: { skip: true } },
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        data: { breadcrumb: { skip: true } }
      },
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSettingsRoutingModule {}
