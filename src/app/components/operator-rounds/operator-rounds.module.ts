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

import { HttpClient } from '@angular/common/http';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { defaultLanguage } from 'src/app/app.constants';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { DynamictableModule } from '@innovapptive.com/dynamictable';
import { StoreModule } from '@ngrx/store';
import { hierarchyReducer } from 'src/app/forms/state/hierarchy.reducer';
import { responseSetReducer } from 'src/app/forms/state/multiple-choice-response.reducer';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EffectsModule } from '@ngrx/effects';
import { ResponseSetEffects } from 'src/app/forms/state/multiple-choice-response.effects';
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
import { SubmissionComponent } from './submission/submission.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { MatTabsModule } from '@angular/material/tabs';
import { PlansComponent } from './plans/plans.component';
import { RoundsComponent } from './rounds/rounds.component';
import { SubmissionSliderComponent } from './submission-slider/submission-slider.component';
import { SubmissionViewComponent } from './submission-view/submission-view.component';
import { ArchivedListComponent } from './archived-list/archived-list.component';
import { ArchivedDeleteModalComponent } from './archived-delete-modal/archived-delete-modal.component';
import { RoundPlanScheduleConfigurationComponent } from './round-plan-schedule-configuration/round-plan-schedule-configuration.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AssetsModalComponent } from './assets-modal/assets-modal.component';
import { HierarchyDeleteConfirmationDialogComponent } from 'src/app/forms/components/hierarchy-container/hierarchy-delete-dialog/hierarchy-delete-dialog.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RoutePlanComponent } from 'src/app/forms/components/hierarchy-container/route-plan/route-plan.component';
import { ObservationsComponent } from './observations/observations.component';
import { IssuesComponent } from './issues/issues.component';
import { ActionsComponent } from './actions/actions.component';
import { IssuesActionsDetailViewComponent } from './issues-actions-detail-view/issues-actions-detail-view.component';

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
    SubmissionComponent,
    SubmissionSliderComponent,
    SubmissionViewComponent,
    ArchivedListComponent,
    ArchivedDeleteModalComponent,
    AssetsModalComponent,
    RoundPlanScheduleConfigurationComponent,
    AssetsModalComponent,
    ObservationsComponent,
    IssuesComponent,
    ActionsComponent,
    IssuesActionsDetailViewComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    OperatorRoundsRoutingModule,
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
    MatDatepickerModule,
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
    MatCheckboxModule,
    StoreModule.forFeature('feature', {
      formConfiguration: formConfigurationReducer,
      responseSet: responseSetReducer,
      hierarchy: hierarchyReducer
    }),
    EffectsModule.forFeature([
      RoundPlanConfigurationEffects,
      ResponseSetEffects
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
