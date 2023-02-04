import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsRoutingModule } from './assets-routing.module';
import { AssetsContainerComponent } from './assets-container/assets-container.component';


@NgModule({
  declarations: [
    AssetsContainerComponent
  ],
  imports: [
    CommonModule,
    AssetsRoutingModule
  ]
})
export class AssetsModule { }
