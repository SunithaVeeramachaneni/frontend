import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AppMaterialModules } from '../material.module';
import { CustomPaginationControlsComponent } from './components/custom-pagination-controls/custom-pagination-controls.component';
import { DummyComponent } from './components/dummy/dummy.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { DropDownFilterPipe } from './pipes/dropdown-filter.pipe';
import { HeaderComponent } from './components/header/header.component';
import { CommonFilterComponent } from './components/common-filter/common-filter.component';
import { DateSegmentComponent } from './components/date-segment/date-segment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { DateTimePipe } from './pipes/date-time.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { NumberToKMPipe } from './pipes/number-to-k-m.pipe';
import { CheckUserHasPermissionDirective } from './directives/check-user-has-permission.directive';

@NgModule({
  declarations: [
    CustomPaginationControlsComponent,
    DummyComponent,
    TimeAgoPipe,
    DropDownFilterPipe,
    DateTimePipe,
    DateSegmentComponent,
    CommonFilterComponent,
    HeaderComponent,
    NumberToKMPipe,
    CheckUserHasPermissionDirective
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AppMaterialModules,
    BreadcrumbModule,
    TranslateModule.forChild({})
  ],
  exports: [
    CustomPaginationControlsComponent,
    DummyComponent,
    TimeAgoPipe,
    DropDownFilterPipe,
    DateTimePipe,
    DateSegmentComponent,
    CommonFilterComponent,
    HeaderComponent,
    NumberToKMPipe,
    CheckUserHasPermissionDirective
  ],
  providers: [DatePipe]
})
export class SharedModule {}
