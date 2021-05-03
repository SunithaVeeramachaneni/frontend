import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InsightsPageRoutingModule } from './insights-routing.module';

import { InsightsPage } from './insights.page';
import { ChartsModule } from 'ng2-charts';
import {NgApexchartsModule} from 'ng-apexcharts';
import { ZingchartAngularModule} from 'zingchart-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InsightsPageRoutingModule,
    ChartsModule,
    NgApexchartsModule,
    ZingchartAngularModule
    ],
  declarations: [InsightsPage]
})
export class InsightsPageModule {}
