import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModules } from '../material.module';
import { CustomPaginationControlsComponent } from './custom-pagination-controls/custom-pagination-controls.component';
import {ToastModule} from './toast/toast.module';
import { DummyComponent } from './dummy/dummy.component';

@NgModule({
  declarations: [CustomPaginationControlsComponent, DummyComponent],
  imports: [
    CommonModule,
    ToastModule.forRoot(),
    AppMaterialModules
  ],
  exports: [
    CustomPaginationControlsComponent,
    DummyComponent
  ]
})
export class SharedModule { }
