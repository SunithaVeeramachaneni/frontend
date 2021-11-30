import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.page';
import { AppMaterialModules } from '../../material.module';

import { DonutChartComponent } from './donut-chart/dont-chart.component';
import { UsersTransactionsGraphComponent } from './users-transactions-graph/users-transactions-graph.component';
import { UsageByModuleGraphComponent } from './usage-by-module-graph/usage-by-module-graph.component';

@NgModule({ 
  imports: [
    FormsModule,
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    SharedModule,
    AppMaterialModules
  ],
  declarations: [
    DashboardComponent,
    DonutChartComponent,
    UsersTransactionsGraphComponent,
    UsageByModuleGraphComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  exports: [],
  entryComponents: []
})
export class DashboardModule {}






