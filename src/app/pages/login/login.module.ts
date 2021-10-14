import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

import { AppMaterialModules } from '../../material.module';
import { SharedModule } from '../../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginRoutingModule,
    CommonModule,
    AppMaterialModules,
    SharedModule,
    NgxSpinnerModule,
  ],
  declarations: [
    LoginComponent
  ],
  exports: [],
  entryComponents: []
})
export class LoginModule {}






