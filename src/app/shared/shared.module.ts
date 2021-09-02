import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModules } from '../material.module';
import { CustomPaginationControlsComponent } from './components/custom-pagination-controls/custom-pagination-controls.component';
import { DummyComponent } from './components/dummy/dummy.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { DropDownFilterPipe } from './pipes/dropdown-filter.pipe';
import { HeaderComponent } from './components/header/header.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    CustomPaginationControlsComponent,
    DummyComponent,
    TimeAgoPipe,
    DropDownFilterPipe,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModules,
    IonicModule
  ],
  exports: [
    CustomPaginationControlsComponent,
    DummyComponent,
    HeaderComponent,
    TimeAgoPipe,
    DropDownFilterPipe
  ]
})
export class SharedModule { }
