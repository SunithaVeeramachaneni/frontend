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

import { IphonePreviewComponent } from './iphone-preview/iphone-preview.component';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { OverlayModule } from '@angular/cdk/overlay';
import { MatDividerModule } from '@angular/material/divider';
import { AddLogicComponent } from './add-logic/add-logic.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { McqResponseComponent } from './utils/mcq-response/mcq-response.component';
import { MatChipsModule } from '@angular/material/chips';
import { AskQuestionComponent } from './add-logic/ask-question/ask-question.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectQuestionsDialogComponent } from './add-logic/select-questions-dialog/select-questions-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ImportQuestionsModalComponent } from './import-questions-modal/import-questions-modal.component';
import { AddDependencyModalComponent } from './add-dependency-modal/add-dependency-modal.component';
import { AddFilterComponent } from './add-filter/add-filter.component';

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
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatMenuModule,
    MatSelectModule,
    MatInputModule,
    MatSliderModule,
    MatTabsModule,
    MatTooltipModule,
    OverlayModule,
    SharedModule,
    MatCardModule,
    MatChipsModule,
    MatMenuModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatDialogModule,
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
    IphonePreviewComponent,
    AddLogicComponent,
    SelectQuestionsDialogComponent,
    AskQuestionComponent,
    McqResponseComponent,
    ImportQuestionsModalComponent,
    AddDependencyModalComponent,
    AddFilterComponent
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
