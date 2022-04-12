import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { AppMaterialModules } from '../../material.module';
import { GridsterModule } from 'angular-gridster2';
import { NgxSpinnerModule } from 'ngx-spinner';

import { ReportConfigurationListModalComponent } from './report-configuration-list-modal/report-configuration-list-modal.component';
import { ReportDeleteModalComponent } from './report-delete-modal/report-delete-modal.component';
import { ReportConfigurationComponent } from './report-configuration/report-configuration.component';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  TranslateCompiler,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { defaultLanguage } from 'src/app/app.constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { DynamictableModule } from '@innovapptive.com/dynamictable';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { NgChartsModule } from 'ng2-charts';
import { ChartComponent } from './chart/chart.component';
import { DashboardContainerComponent } from './dashboard-container/dashboard-container.component';
import { ReportsComponent } from './reports/reports.component';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { DashboardConfigurationComponent } from './dashboard-configuration/dashboard-configuration.component';
import { WidgetConfigurationModalComponent } from './widget-configuration-modal/widget-configuration-modal.component';
import { WidgetComponent } from './widget/widget.component';
import { ChartVariantComponent } from './chart-variant/chart-variant.component';
import { CreateUpdateDashboardDialogComponent } from './dashboard-create-update-dialog/dashboard-create-update-dialog.component';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { ConfirmDialog } from './confirm-dialog/confirm-dialog.component';
import { WidgetDeleteModalComponent } from './widget-delete-modal/widget-delete-modal.component';
import { AlertDialog } from './alert-dialog/alert-dialog.component';
import { ReportSaveAsModalComponent } from './report-save-as-modal/report-save-as-modal.component';
import { DynamicFiltersComponent } from './dynamic-filters/dynamic-filters.component';

export const customTranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/dashboard/', '.json');

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    SharedModule,
    AppMaterialModules,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: customTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true,
      defaultLanguage,
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler
      }
    }),
    DynamictableModule,
    NgChartsModule,
    GridsterModule,
    NgxShimmerLoadingModule,
    NgxSpinnerModule
  ],
  declarations: [
    ReportConfigurationListModalComponent,
    ReportDeleteModalComponent,
    ReportConfigurationComponent,
    ChartComponent,
    DashboardContainerComponent,
    ReportsComponent,
    DashboardsComponent,
    DashboardConfigurationComponent,
    WidgetConfigurationModalComponent,
    WidgetComponent,
    ChartVariantComponent,
    CreateUpdateDashboardDialogComponent,
    ConfirmDialog,
    AlertDialog,
    WidgetDeleteModalComponent,
    ReportSaveAsModalComponent,
    DynamicFiltersComponent
  ],
  exports: [],
  entryComponents: []
})
export class DashboardModule {
  constructor(
    public translateService: TranslateService,
    public commonService: CommonService
  ) {
    this.translateService.store.onLangChange.subscribe((translate) => {
      this.translateService.use(translate.lang);
    });
    this.commonService.translateLanguageAction$.subscribe((lang) => {
      this.translateService.use(lang);
    });
  }
}
