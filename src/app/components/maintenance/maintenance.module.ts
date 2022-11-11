import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceComponent } from './maintenance.component';

import { SharedModule } from '../../shared/shared.module';
import { ModalComponent } from './modal/modal.component';
import {
  TranslateCompiler,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { defaultLanguage } from 'src/app/app.constants';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CommonService } from 'src/app/shared/services/common.service';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { MCCCardComponent } from './mcc-card/mcc-card.component';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

export const customTranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/maintenance/', '.json');

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MaintenanceRoutingModule,
    CommonModule,
    MatNativeDateModule,
    MatGridListModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    SharedModule,
    NgxShimmerLoadingModule,
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
    })
  ],
  declarations: [MaintenanceComponent, ModalComponent, MCCCardComponent],
  exports: [],
  entryComponents: []
})
export class MaintenanceModule {
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
