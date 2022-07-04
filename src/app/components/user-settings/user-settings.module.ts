import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { UserSettingsContainerComponent } from './user-settings-container/user-settings-container.component';
import { ProfileComponent } from './profile/profile.component';
import { AppMaterialModules } from 'src/app/material.module';
import { NgxMatIntlTelInputModule } from 'ngx-mat-intl-tel-input';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserSettingsContainerComponent, ProfileComponent],
  imports: [
    CommonModule,
    UserSettingsRoutingModule,
    ReactiveFormsModule,
    AppMaterialModules,
    NgxMatIntlTelInputModule
  ]
})
export class UserSettingsModule {}
