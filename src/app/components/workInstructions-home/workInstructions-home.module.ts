

import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {LocationStrategy, HashLocationStrategy, CommonModule} from '@angular/common';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgpSortModule } from "ngp-sort-pipe";
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { DelayFocusDirective } from '../../directives/delayfocus';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


import { AppMaterialModules } from '../../material.module';
import { ModalModule } from '../modal/modal.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { IonicModule } from '@ionic/angular';
import { InstructionsHomePageRoutingModule } from './workInstructions-home-routing.module';
import { CategoriesComponent } from './categories/categories.component';
import { WorkInstructionsHomeComponent } from './workInstructions-home.page';

import {TimeAgoPipe} from "../../pipes/time-ago.pipe";
import {DropDownFilterPipe} from "../../pipes/dropdown-filter.pipe";

import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    InstructionsHomePageRoutingModule,
    OrderModule,
    NgpSortModule,
    Ng2SearchPipeModule,
    NgxPaginationModule
  ],
  declarations: [
    TimeAgoPipe,DropDownFilterPipe,
    WorkInstructionsHomeComponent, 
    CategoriesComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  exports: [
    TimeAgoPipe,
    DropDownFilterPipe
  ],
  entryComponents: []
})
export class WorkInstructionsHomeModule {}






