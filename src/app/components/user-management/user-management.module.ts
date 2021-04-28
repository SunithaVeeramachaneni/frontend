import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModules } from '../../material.module';
import { HttpClientModule } from '@angular/common/http';

import {LoginComponent} from './login/login.component';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, AppMaterialModules, HttpClientModule],
  providers: [],
  bootstrap: [LoginComponent],
  exports: [
    LoginComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
  entryComponents: [LoginComponent]
})

export class UserManagementModule {}
