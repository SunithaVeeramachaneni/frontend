import { MatExpansionModule } from '@angular/material/expansion';
import { MatTreeModule } from '@angular/material/tree';
import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TranslateCompiler,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RaceDynamicFormRoutingModule } from './race-dynamic-form-routing.module';
import { FormModule } from 'src/app/forms/form.module';

import { FormContainerComponent } from './form-container/form-container.component';
import { FormListComponent } from './form-list/form-list.component';
import { FormDetailComponent } from './form-detail/form-detail.component';
import { SubmissionComponent } from './submission/submission.component';
import { ResponseSetComponent } from './response-set/response-set.component';
import { PublicLibraryComponent } from './public-library/public-library.component';
import { FormConfigurationModalComponent } from './form-configuration-modal/form-configuration-modal.component';
import { FormConfigurationComponent } from './form-configuration/form-configuration.component';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';

import { HttpClient } from '@angular/common/http';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { defaultLanguage } from 'src/app/app.constants';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { DynamictableModule } from '@innovapptive.com/dynamictable';
import { StoreModule } from '@ngrx/store';
import { formConfigurationReducer } from 'src/app/forms/state/form-configuration.reducer';
import { responseSetReducer } from 'src/app/forms/state/multiple-choice-response.reducer';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EffectsModule } from '@ngrx/effects';
import { FormConfigurationEffects } from 'src/app/forms/state/form-configuration.effects';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ResponseSetEffects } from 'src/app/forms/state/multiple-choice-response.effects';
import { SubmissionSliderComponent } from './submission-slider/submission-slider.component';
import { SubmissionViewComponent } from './submission-view/submission-view.component';
import { SelectQuestionsDialogComponent } from 'src/app/forms/components/add-logic/select-questions-dialog/select-questions-dialog.component';
import { AvatarComponent } from './form-configuration/avatar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ArchivedListComponent } from './archived-list/archived-list.component';
import { ArchivedDeleteModalComponent } from './archived-delete-modal/archived-delete-modal.component';
import { ImportQuestionsModalComponent } from './import-questions/import-questions-modal/import-questions-modal.component';

export const customTranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/race-dynamic-forms/', '.json');

@NgModule({
  declarations: [
    FormContainerComponent,
    FormListComponent,
    FormDetailComponent,
    SubmissionComponent,
    ResponseSetComponent,
    PublicLibraryComponent,
    FormConfigurationModalComponent,
    FormConfigurationComponent,
    SubmissionSliderComponent,
    SubmissionViewComponent,
    SelectQuestionsDialogComponent,
    AvatarComponent,
    ArchivedListComponent,
    ArchivedDeleteModalComponent,
    ImportQuestionsModalComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RaceDynamicFormRoutingModule,
    DragDropModule,
    CommonModule,
    FormModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatAutocompleteModule,
    MatCardModule,
    MatTreeModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatExpansionModule,
    MatTooltipModule,
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
    }),
    DynamictableModule,
    OverlayModule,
    MatSelectModule,
    MatCheckboxModule,
    StoreModule.forFeature('feature', {
      formConfiguration: formConfigurationReducer,
      responseSet: responseSetReducer
    }),
    EffectsModule.forFeature([FormConfigurationEffects, ResponseSetEffects])
  ],
  exports: [
    FormContainerComponent,
    FormListComponent,
    FormDetailComponent,
    SubmissionComponent,
    ResponseSetComponent,
    PublicLibraryComponent,
    FormConfigurationModalComponent,
    FormConfigurationComponent,
    SelectQuestionsDialogComponent,
    AvatarComponent
  ]
})
export class RaceDynamicFormModule {
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
