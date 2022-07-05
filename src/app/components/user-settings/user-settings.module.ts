import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { UserSettingsContainerComponent } from './user-settings-container/user-settings-container.component';
import { ProfileComponent } from './profile/profile.component';
import { AppMaterialModules } from 'src/app/material.module';
import { NgxMatIntlTelInputModule } from 'ngx-mat-intl-tel-input';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  TranslateCompiler,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { CommonService } from 'src/app/shared/services/common.service';
import { defaultLanguage } from 'src/app/app.constants';

export const customTranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/user-settings/', '.json');

@NgModule({
  declarations: [UserSettingsContainerComponent, ProfileComponent],
  imports: [
    CommonModule,
    UserSettingsRoutingModule,
    ReactiveFormsModule,
    AppMaterialModules,
    NgxMatIntlTelInputModule,
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
  ]
})
export class UserSettingsModule {
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
