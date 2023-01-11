import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { LoginRoutingModule } from './login-routing.module';

import { LoginComponent } from './login.component';
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
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { LoginErrorComponent } from './login-error/login-error.component';
import { LoginErrorModalComponent } from './login-error-modal/login-error-modal.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
export const customTranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/login/', '.json');

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    SharedModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
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
  declarations: [LoginComponent, LoginErrorComponent, LoginErrorModalComponent],
  exports: [],
  entryComponents: []
})
export class LoginModule {
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
