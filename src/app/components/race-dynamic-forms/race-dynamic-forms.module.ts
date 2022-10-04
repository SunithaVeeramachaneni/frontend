import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RaceDynamicFormsRoutingModule } from './race-dynamic-forms-routing.module';
import { RaceDynamicFormsListViewComponent } from './race-dynamic-forms-list-view/race-dynamic-forms-list-view.component';
import { RaceDynamicFormsContainerComponent } from './race-dynamic-forms-container/race-dynamic-forms-container.component';
import { CreateFormComponent } from './create-form/create-form.component';

import { SharedModule } from '../../shared/shared.module';
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
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { QuillMaterialComponent } from '../work-instructions/steps/quill-material/quill-material.component';
import { IphonePreviewComponent } from './iphone-preview/iphone-preview.component';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

export const customTranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/maintenance/', '.json');

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RaceDynamicFormsRoutingModule,
    CommonModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    SharedModule,
    MatCardModule,
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
  declarations: [
    RaceDynamicFormsListViewComponent,
    RaceDynamicFormsContainerComponent,
    CreateFormComponent,
    QuillMaterialComponent,
    IphonePreviewComponent
  ],
  exports: [],
  entryComponents: []
})
export class RaceDynamicFormsModule {
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
