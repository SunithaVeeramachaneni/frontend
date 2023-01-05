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

import { HttpClient } from '@angular/common/http';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { defaultLanguage } from 'src/app/app.constants';
import { StoreModule } from '@ngrx/store';
import { formConfigurationReducer } from 'src/app/forms/state/form-configuration.reducer';
import { DragDropModule } from '@angular/cdk/drag-drop';

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
    FormConfigurationComponent
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
    MatInputModule,
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
    StoreModule.forFeature('feature', {
      formConfiguration: formConfigurationReducer
    })
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
