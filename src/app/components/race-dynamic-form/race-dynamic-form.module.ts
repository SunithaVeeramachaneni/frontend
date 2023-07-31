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
import { ResponseSetComponent } from './response-set/response-set.component';
import { PublicLibraryComponent } from './public-library/public-library.component';
import { FormHeaderConfigurationComponent } from './form-header-configuration/form-header-configuration.component';
import { FormDetailConfigurationComponent } from './form-detail-configuration/form-detail-configuration.component';

import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
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
import { SelectQuestionsDialogComponent } from 'src/app/forms/components/add-logic/select-questions-dialog/select-questions-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ArchivedListComponent } from './archived-list/archived-list.component';
import { ArchivedFormListComponent } from './archived-form-list/archived-form-list.component';
import { ArchivedTemplateListComponent } from './archived-template-list/archived-template-list.component';
import { ArchivedDeleteModalComponent } from './archived-delete-modal/archived-delete-modal.component';
import { DeleteTemplateModalComponent } from './delete-template-modal/delete-template-modal.component';
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
import { TemplateHeaderConfigurationComponent } from './template-header-configuration/template-header-configuration.component';
import { TemplateDetailConfigurationComponent } from './template-configuration/template-detail-configuration.component';
import { SaveTemplateConfirmModalComponent } from './save-template-confirm-modal/save-template-confirm-modal.component';
import { SaveTemplateContainerComponent } from './save-template-container/save-template-container.component';
import { TemplateContainerComponent } from './template-container/template-container.component';
import { EditTemplateNameModalComponent } from './edit-template-name-modal/edit-template-name-modal.component';
import { unitOfMeasurementReducer } from 'src/app/forms/state/unit-of-measurement.reducer';
import { quickResponseReducer } from 'src/app/forms/state/quick-responses.reducer';
import { globalResponseReducer } from 'src/app/forms/state/global-responses.reducer';
import { UnitOfMeasurementEffects } from 'src/app/forms/state/unit-of-measurement.effects';
import { QuickResponseEffects } from 'src/app/forms/state/quick-responses.effects';
import { GlobalResponseEffects } from 'src/app/forms/state/global-response.effects';
import { InspectionObservationsComponent } from './inspection-observations/inspection-observations.component';
import { FormModalComponent } from './form-modal/form-modal.component';
import { FormEditViewComponent } from './form-modal/form-edit-view.component';
import { ImportTemplateListComponent } from 'src/app/components/race-dynamic-form/import-template-list/import-template-list.component';
import { ImportFormListComponent } from 'src/app/components/race-dynamic-form/import-form-list/import-form-list.component';
import { TemplateAffectedFormsModalComponent } from './template-configuration/template-affected-forms-modal/template-affected-forms-modal.component';
import { AffectedFormTemplateSliderComponent } from 'src/app/components/race-dynamic-form/affected-form-template-slider/affected-form-template-slider.component';
import { QuillMaterialComponent } from 'src/app/shared/components/quill-material/quill-material.component';
import { ArchiveTemplateModalComponent } from './archive-template-modal/archive-template-modal.component';
import { TemplateModalComponent } from './template-modal/template-modal.component';
import { ConfirmModalPopupComponent } from './confirm-modal-popup/confirm-modal-popup/confirm-modal-popup.component';

export const customTranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/race-dynamic-forms/', '.json');

@NgModule({
  declarations: [
    FormContainerComponent,
    FormListComponent,
    FormDetailComponent,
    ResponseSetComponent,
    PublicLibraryComponent,
    FormHeaderConfigurationComponent,
    FormDetailConfigurationComponent,
    SelectQuestionsDialogComponent,
    ArchivedListComponent,
    ArchivedFormListComponent,
    ArchivedTemplateListComponent,
    DeleteTemplateModalComponent,
    AssignInspectionComponent,
    ArchivedDeleteModalComponent,
    ArchiveTemplateModalComponent,
    ImportQuestionsModalComponent,
    SchedulerComponent,
    FormsComponent,
    InspectionComponent,
    TemplateListComponent,
    SaveTemplateNamingModalComponent,
    TemplateHeaderConfigurationComponent,
    TemplateDetailConfigurationComponent,
    SaveTemplateConfirmModalComponent,
    SaveTemplateContainerComponent,
    TemplateContainerComponent,
    EditTemplateNameModalComponent,
    InspectionObservationsComponent,
    FormModalComponent,
    FormEditViewComponent,
    ImportTemplateListComponent,
    ImportFormListComponent,
    TemplateAffectedFormsModalComponent,
    AffectedFormTemplateSliderComponent,
    QuillMaterialComponent,
    ConfirmModalPopupComponent,
    TemplateModalComponent
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
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {}
    }
  ],
  exports: [
    FormContainerComponent,
    FormListComponent,
    FormDetailComponent,
    ResponseSetComponent,
    PublicLibraryComponent,
    FormHeaderConfigurationComponent,
    FormDetailConfigurationComponent,
    SelectQuestionsDialogComponent,
    TemplateDetailConfigurationComponent,
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
