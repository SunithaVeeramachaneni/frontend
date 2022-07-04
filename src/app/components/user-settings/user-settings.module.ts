import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { UserSettingsContainerComponent } from './user-settings-container/user-settings-container.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    UserSettingsContainerComponent,
    ProfileComponent
  ],
  imports: [CommonModule, UserSettingsRoutingModule]
})
export class UserSettingsModule {}
