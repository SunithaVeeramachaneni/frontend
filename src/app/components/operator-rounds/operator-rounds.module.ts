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
import { FormModule } from 'src/app/forms/form.module';

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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpClient } from '@angular/common/http';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { defaultLanguage } from 'src/app/app.constants';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { DynamictableModule } from '@innovapptive.com/dynamictable';
import { StoreModule } from '@ngrx/store';
import { hierarchyReducer } from 'src/app/forms/state/hierarchy.reducer';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EffectsModule } from '@ngrx/effects';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OperatorRoundsRoutingModule } from './operator-rounds-routing.module';
import { OperatorRoundsContainerComponent } from '../operator-rounds/operator-rounds-container/operator-rounds-container.component';
import { RaceDynamicFormModule } from '../race-dynamic-form/race-dynamic-form.module';
import { RoundPlanListComponent } from './round-plan-list/round-plan-list.component';
import { RoundPlanConfigurationComponent } from './round-plan-configuration/round-plan-configuration.component';
import { RoundPlanConfigurationModalComponent } from './round-plan-configuration-modal/round-plan-configuration-modal.component';
import { RoundPlanConfigurationEffects } from 'src/app/forms/state/round-plan-configuration.effects';
import { formConfigurationReducer } from 'src/app/forms/state/builder/builder.reducer';
import { ImportTaskModalComponent } from './import-task-modal/import-task-modal.component';
import { HierarchyContainerComponent } from 'src/app/forms/components/hierarchy-container/hierarchy-container.component';
import { NodeComponent } from 'src/app/forms/components/hierarchy-container/node/node.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { MatTabsModule } from '@angular/material/tabs';
import { PlansComponent } from './plans/plans.component';
import { RoundsComponent } from './rounds/rounds.component';
import { ArchivedListComponent } from './archived-list/archived-list.component';
import { ArchivedDeleteModalComponent } from './archived-delete-modal/archived-delete-modal.component';
import { MatRadioModule } from '@angular/material/radio';

import { AssetsModalComponent } from './assets-modal/assets-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HierarchyDeleteConfirmationDialogComponent } from 'src/app/forms/components/hierarchy-container/hierarchy-delete-dialog/hierarchy-delete-dialog.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RoutePlanComponent } from 'src/app/forms/components/hierarchy-container/route-plan/route-plan.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { unitOfMeasurementReducer } from 'src/app/forms/state/unit-of-measurement.reducer';
import { UnitOfMeasurementEffects } from 'src/app/forms/state/unit-of-measurement.effects';
import { quickResponseReducer } from 'src/app/forms/state/quick-responses.reducer';
import { QuickResponseEffects } from 'src/app/forms/state/quick-responses.effects';
import { globalResponseReducer } from 'src/app/forms/state/global-responses.reducer';
import { GlobalResponseEffects } from 'src/app/forms/state/global-response.effects';
import { RoundObservationsComponent } from './round-observations/round-observations.component';
import { ShiftChangeWarningModalComponent } from './shift-change-warning-modal/shift-change-warning-modal.component';
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
export const customTranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/operator-rounds/', '.json');

@NgModule({
  declarations: [
    OperatorRoundsContainerComponent,
    RoundPlanListComponent,
    RoundPlanConfigurationComponent,
    RoundPlanConfigurationModalComponent,
    ImportTaskModalComponent,
    HierarchyContainerComponent,
    HierarchyDeleteConfirmationDialogComponent,
    NodeComponent,
    RoutePlanComponent,
    SchedulerComponent,
    PlansComponent,
    RoundsComponent,
    ArchivedListComponent,
    ArchivedDeleteModalComponent,
    AssetsModalComponent,
    AssetsModalComponent,
    RoundObservationsComponent,
    ShiftChangeWarningModalComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    OperatorRoundsRoutingModule,
    SharedModule,
    RaceDynamicFormModule,
    DragDropModule,
    CommonModule,
    FormModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatToolbarModule,
    MatChipsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule,
    MatAutocompleteModule,
    MatCardModule,
    MatTreeModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatExpansionModule,
    MatTooltipModule,
    MatTabsModule,
    MatRadioModule,
    MatButtonToggleModule,
    NgxShimmerLoadingModule,
    NgxMatDatetimePickerModule,
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
      hierarchy: hierarchyReducer,
      unitOfMeasurement: unitOfMeasurementReducer,
      quickResponse: quickResponseReducer,
      globalResponse: globalResponseReducer
    }),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    EffectsModule.forFeature([
      RoundPlanConfigurationEffects,
      UnitOfMeasurementEffects,
      QuickResponseEffects,
      GlobalResponseEffects
    ])
  ],
  exports: [OperatorRoundsContainerComponent]
})
export class OperatorRoundsModule {
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
