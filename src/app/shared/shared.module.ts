import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModules } from '../material.module';
import { CustomPaginationControlsComponent } from './custom-pagination-controls/custom-pagination-controls.component';
import {ToastModule} from './toast/toast.module';
import { DummyComponent } from './dummy/dummy.component';
import { DropDownFilterPipe } from '../pipes/dropdown-filter.pipe';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';

@NgModule({
  declarations: [
    CustomPaginationControlsComponent,
    DummyComponent,
    DropDownFilterPipe,
    TimeAgoPipe
  ],
  imports: [
    CommonModule,
    ToastModule.forRoot(),
    AppMaterialModules
  ],
  exports: [
    CustomPaginationControlsComponent,
    DummyComponent,
    DropDownFilterPipe,
    TimeAgoPipe,
    CommonModule,
    AppMaterialModules
  ]
})
export class SharedModule { }
