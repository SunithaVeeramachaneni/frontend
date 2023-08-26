import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  TranslateCompiler,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { IntegrationsRoutingModule } from './integrations-routing.module';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { DynamictableModule } from '@innovapptive.com/dynamictable';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { defaultLanguage } from 'src/app/app.constants';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { IntegrationsComponent } from './integrations/integrations.component';
import { IntegrationsManagementContainerComponent } from './integrations-management-container/integrations-management-container.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';

export const customTranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/tenant-management/', '.json');

@NgModule({
  declarations: [
    IntegrationsComponent,
    IntegrationsManagementContainerComponent
  ],
  imports: [
    CommonModule,
    IntegrationsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MatFormFieldModule,
    MatRadioModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
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
    NgxShimmerLoadingModule,
    NgxSpinnerModule
  ],
  providers: [TitleCasePipe]
})
export class IntegrationsModule {
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
