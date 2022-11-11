import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SparePartsRoutingModule } from './spare-parts-routing.module';
import { SparePartsComponent } from './spare-parts.component';
import { SharedModule } from '../../shared/shared.module';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { HttpClient } from '@angular/common/http';
import { defaultLanguage } from 'src/app/app.constants';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { SPCCCardComponent } from './spcc-card/spcc-card.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';

export const customTranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/spare-parts/', '.json');

@NgModule({
  imports: [
    ReactiveFormsModule,
    SparePartsRoutingModule,
    CommonModule,
    SharedModule,
    MatNativeDateModule,
    MatGridListModule,
    MatMenuModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
    NgxShimmerLoadingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: customTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true,
      defaultLanguage
    })
  ],
  declarations: [SparePartsComponent, SPCCCardComponent],
  providers: [],
  exports: [],
  entryComponents: []
})
export class SparePartsModule {
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
