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
import { formConfigurationReducer } from 'src/app/forms/state/builder/builder.reducer';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EffectsModule } from '@ngrx/effects';
import { FormConfigurationEffects } from 'src/app/forms/state/form-configuration.effects';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SubmissionSliderComponent } from './submission-slider/submission-slider.component';
import { SubmissionViewComponent } from './submission-view/submission-view.component';
import { SelectQuestionsDialogComponent } from 'src/app/forms/components/add-logic/select-questions-dialog/select-questions-dialog.component';
import { AvatarComponent } from './form-configuration/avatar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ArchivedListComponent } from './archived-list/archived-list.component';
import { ArchivedDeleteModalComponent } from './archived-delete-modal/archived-delete-modal.component';
import { ImportQuestionsModalComponent } from './import-questions/import-questions-modal/import-questions-modal.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { FormsComponent } from './forms/forms.component';
import { InspectionComponent } from './inspection/inspection.component';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AssignInspectionComponent } from './assign-inspection/assign-inspection.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { SaveTemplateNamingModalComponent } from './save-template-naming-modal/save-template-naming-modal.component';
import { TemplateConfigurationModalComponent } from './template-configuration-modal/template-configuration-modal.component';
import { TemplateConfigurationComponent } from './template-configuration/template-configuration.component';
import { SaveTemplateConfirmModalComponent } from './save-template-confirm-modal/save-template-confirm-modal.component';
import { SaveTemplateContainerComponent } from './save-template-container/save-template-container.component';
import { CreateFromTemplateModalComponent } from './create-from-template-modal/create-from-template-modal.component';
import { TemplateContainerComponent } from './template-container/template-container.component';
import { EditTemplateNameModalComponent } from './edit-template-name-modal/edit-template-name-modal.component';
import { unitOfMeasurementReducer } from 'src/app/forms/state/unit-of-measurement.reducer';
import { quickResponseReducer } from 'src/app/forms/state/quick-responses.reducer';
import { globalResponseReducer } from 'src/app/forms/state/global-responses.reducer';
import { UnitOfMeasurementEffects } from 'src/app/forms/state/unit-of-measurement.effects';
import { QuickResponseEffects } from 'src/app/forms/state/quick-responses.effects';
import { GlobalResponseEffects } from 'src/app/forms/state/global-response.effects';
import { InspectionObservationsComponent } from './inspection-observations/inspection-observations.component';
import { QuillMaterialComponent } from 'src/app/shared/components/quill-material/quill-material.component';

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
    AssignInspectionComponent,
    ArchivedDeleteModalComponent,
    ImportQuestionsModalComponent,
    SchedulerComponent,
    FormsComponent,
    InspectionComponent,
    TemplateListComponent,
    SaveTemplateNamingModalComponent,
    TemplateConfigurationModalComponent,
    TemplateConfigurationComponent,
    SaveTemplateConfirmModalComponent,
    SaveTemplateContainerComponent,
    CreateFromTemplateModalComponent,
    TemplateContainerComponent,
    EditTemplateNameModalComponent,
    InspectionObservationsComponent,
    QuillMaterialComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RaceDynamicFormRoutingModule,
    DragDropModule,
    CommonModule,
    SharedModule,
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
    MatButtonToggleModule,
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
    MatDatepickerModule,
    MatCheckboxModule,
    MatTabsModule,
    MatRadioModule,
    StoreModule.forFeature('feature', {
      formConfiguration: formConfigurationReducer,
      unitOfMeasurement: unitOfMeasurementReducer,
      quickResponse: quickResponseReducer,
      globalResponse: globalResponseReducer
    }),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    EffectsModule.forFeature([
      FormConfigurationEffects,
      UnitOfMeasurementEffects,
      QuickResponseEffects,
      GlobalResponseEffects
    ])
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
    AvatarComponent,
    TemplateConfigurationComponent,
    QuillMaterialComponent
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
