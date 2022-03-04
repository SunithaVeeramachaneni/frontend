import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SparePartsRoutingModule } from './spare-parts-routing.module';
import { SparePartsComponent } from './spare-parts.component';
import { SharedModule } from '../../shared/shared.module';
import { AppMaterialModules } from '../../material.module';
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

export const customTranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/spare-parts/', '.json');

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SparePartsRoutingModule,
    CommonModule,
    SharedModule,
    AppMaterialModules,
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
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
