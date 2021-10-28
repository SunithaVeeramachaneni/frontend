import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModules } from '../material.module';
import { CustomPaginationControlsComponent } from './components/custom-pagination-controls/custom-pagination-controls.component';
import { DummyComponent } from './components/dummy/dummy.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { DropDownFilterPipe } from './pipes/dropdown-filter.pipe';
import { HeaderComponent } from './components/header/header.component';
import { CommonFilterComponent } from './components/common-filter/common-filter.component';
import { DateSegmentComponent } from './components/date-segment/date-segment.component';
import { IonicModule } from '@ionic/angular';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'xng-breadcrumb';

@NgModule({
  declarations: [
    CustomPaginationControlsComponent,
    DummyComponent,
    TimeAgoPipe,
    DropDownFilterPipe,
    HeaderComponent,
    CommonFilterComponent,
    DateSegmentComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AppMaterialModules,
    IonicModule,
    PopoverModule.forRoot(),
    BreadcrumbModule
  ],
  exports: [
    CustomPaginationControlsComponent,
    DummyComponent,
    HeaderComponent,
    TimeAgoPipe,
    DropDownFilterPipe,
    CommonFilterComponent,
    DateSegmentComponent
  ]
})
export class SharedModule { }
