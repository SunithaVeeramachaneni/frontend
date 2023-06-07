import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormWidgetComponent } from './components/form-widget/form-widget.component';
import { PageComponent } from './components/page/page.component';
import { SectionComponent } from './components/section/section.component';
import { QuestionComponent } from './components/question/question.component';
import { ResponseTypeComponent } from './components/response-type/response-type.component';
import { PreviewComponent } from './components/preview/preview.component';
import { AddLogicComponent } from './components/add-logic/add-logic.component';
import { AddFilterComponent } from './components/add-filter/add-filter.component';
import { IphoneComponent } from './components/iphone/iphone.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ResponseTypeSideDrawerComponent } from './components/response-type-side-drawer/response-type-side-drawer.component';

import { TableComponent } from './components/field-types/table/table.component';
import { ResponseTypeButtonComponent } from './components/response-type-button/response-type-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { ArrayComponent } from './components/field-types/array/array.component';
import { DateComponent } from './components/field-types/date/date.component';
import { ReadOnlyComponent } from './components/field-types/read-only/read-only.component';
import { TextComponent } from './components/field-types/text/text.component';
import { DropDownComponent } from './components/field-types/drop-down/drop-down.component';

import { ImageComponent } from './components/field-types/image/image.component';
import { GlobalResponseTypeSideDrawerComponent } from './components/global-response-type-side-drawer/global-response-type-side-drawer.component';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { ImportQuestionsSliderComponent } from './components/import-questions/import-questions-slider/import-questions-slider.component';
import { AddPageOrSelectExistingPageModalComponent } from './components/import-questions/add-page-or-select-existing-page-modal/add-page-or-select-existing-page-modal.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { HyperlinkSideDrawerComponent } from './components/hyperlink-side-drawer/hyperlink-side-drawer.component';
import { BuilderComponent } from './components/builder/builder.component';
import { HierarchyNodeComponent } from './components/hierarchy-node/hierarchy-node.component';
import { HierarchyModalComponent } from './components/hierarchy-modal/hierarchy-modal.component';
import { HierarchyLocationsListComponent } from './components/hierarchy-locations-list/hierarchy-locations-list.component';
import { HierarchyAssetsListComponent } from './components/hierarchy-assets-list/hierarchy-assets-list.component';
import { ShowHierarchyPopupComponent } from './components/show-hierarchy-popup/show-hierarchy-popup.component';
import { QuillMaterialComponent } from './components/field-types/instructions/quill-material/quill-material.component';
import { TagSelectComponent } from './components/field-types/instructions/tag-select/tag-select.component';
import { InstructionImageComponent } from './components/field-types/instructions/instruction-image/instruction-image.component';
import { InstructionPdfComponent } from './components/field-types/instructions/instruction-pdf/instruction-pdf.component';
import { InstructionPdfPreviewComponent } from './components/field-types/instructions/instruction-pdf-preview/instruction-pdf-preview.component';
import { PDFBuilderComponent } from './components/pdf-builder/pdf-builder.component';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { QuestionPreviewComponent } from './components/pdf-builder/question-preview/question-preview.component';
import { ScheduleSuccessModalComponent } from './components/schedular/schedule-success-modal/schedule-success-modal.component';
import { ScheduleConfigurationComponent } from './components/schedular/schedule-configuration/schedule-configuration.component';
import { PDFPreviewComponent } from './components/pdf-preview/pdf-preview.component';

import { SharedModule } from '../shared/shared.module';
import { DynamicPreviewResponseTypeLoaderDirective } from './components/preview/directives/dynamic-preview-response-type-loader.directive';
import { PreviewQuestionComponent } from './components/preview/preview-question/preview-question.component';
import { ReadOnlyResponseComponent } from './components/preview/response-types/read-only-response/read-only-response.component';
import { InstructionResponseComponent } from './components/preview/response-types/instruction-response/instruction-response.component';
import { TextAnswerResponseComponent } from './components/preview/response-types/text-answer-response/text-answer-response.component';
import { NumberResponseComponent } from './components/preview/response-types/number-response/number-response.component';
import { ScanResponseComponent } from './components/preview/response-types/scan-response/scan-response.component';
import { DateTimeResponseComponent } from './components/preview/response-types/date-time-response/date-time-response.component';
import { HyperlinkResponseComponent } from './components/preview/response-types/hyperlink-response/hyperlink-response.component';
import { CheckboxResponseComponent } from './components/preview/response-types/checkbox-response/checkbox-response.component';
import { SignatureResponseComponent } from './components/preview/response-types/signature-response/signature-response.component';
import { SliderResponseComponent } from './components/preview/response-types/slider-response/slider-response.component';
import { LocationResponseComponent } from './components/preview/response-types/location-response/location-response.component';
import { DateRangeResponseComponent } from './components/preview/response-types/date-range-response/date-range-response.component';
import { DropdownResponseComponent } from './components/preview/response-types/dropdown-response/dropdown-response.component';
import { ArrayResponseComponent } from './components/preview/response-types/array-response/array-response.component';
import { VisibleInputResponseComponent } from './components/preview/response-types/visible-input-response/visible-input-response.component';
import { AttachmentResponseComponent } from './components/preview/response-types/attachment-response/attachment-response.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DonutChartComponent } from './components/donut-chart/donut-chart.component';
import { IssuesListComponent } from './components/issues-list/issues-list.component';
import { ActionsListComponent } from './components/actions-list/actions-list.component';
import { IssuesActionsViewComponent } from './components/issues-actions-view/issues-actions-view.component';
import { DynamictableModule } from '@innovapptive.com/dynamictable';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AssignedToComponent } from './components/assigned-to/assigned-to.component';
import { ObservationsComponent } from './components/observations/observations.component';
import { SchedulersComponent } from './components/schedulers/schedulers.component';
import { FormsComponent } from './components/forms/forms.component';
import { InspectionComponent } from './inspection/inspection.component';
@NgModule({
  declarations: [
    FormWidgetComponent,
    PageComponent,
    SectionComponent,
    QuestionComponent,
    ResponseTypeComponent,
    ReadOnlyResponseComponent,
    InstructionResponseComponent,
    TextAnswerResponseComponent,
    NumberResponseComponent,
    ScanResponseComponent,
    DateTimeResponseComponent,
    HyperlinkResponseComponent,
    CheckboxResponseComponent,
    SignatureResponseComponent,
    SliderResponseComponent,
    LocationResponseComponent,
    DateRangeResponseComponent,
    DropdownResponseComponent,
    ArrayResponseComponent,
    VisibleInputResponseComponent,
    AttachmentResponseComponent,
    PreviewQuestionComponent,
    PreviewComponent,
    AddLogicComponent,
    AddFilterComponent,
    ResponseTypeSideDrawerComponent,
    TableComponent,
    ResponseTypeButtonComponent,
    IphoneComponent,
    ArrayComponent,
    DateComponent,
    ReadOnlyComponent,
    TextComponent,
    DropDownComponent,
    ImageComponent,
    GlobalResponseTypeSideDrawerComponent,
    ImportQuestionsSliderComponent,
    AddPageOrSelectExistingPageModalComponent,
    HyperlinkSideDrawerComponent,
    BuilderComponent,
    PDFBuilderComponent,
    PDFPreviewComponent,
    QuestionPreviewComponent,
    HierarchyNodeComponent,
    HierarchyModalComponent,
    HierarchyLocationsListComponent,
    HierarchyAssetsListComponent,
    ShowHierarchyPopupComponent,
    QuillMaterialComponent,
    TagSelectComponent,
    InstructionImageComponent,
    InstructionPdfComponent,
    InstructionPdfPreviewComponent,
    ScheduleSuccessModalComponent,
    ScheduleConfigurationComponent,
    DynamicPreviewResponseTypeLoaderDirective,
    DonutChartComponent,
    IssuesListComponent,
    ActionsListComponent,
    IssuesActionsViewComponent,
    AssignedToComponent,
    ObservationsComponent,
    SchedulersComponent,
    FormsComponent,
    InspectionComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CdkScrollableModule,
    MatAutocompleteModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    DragDropModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatSliderModule,
    MatChipsModule,
    MatTabsModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatDividerModule,
    MatSelectModule,
    MatTooltipModule,
    MatRadioModule,
    NgxShimmerLoadingModule,
    TranslateModule.forChild({}),
    MatDatepickerModule,
    PdfViewerModule,
    MatProgressSpinnerModule,
    DynamictableModule,
    NgxEchartsModule.forRoot({
      echarts
    }),
    MatToolbarModule
  ],
  exports: [
    FormWidgetComponent,
    PageComponent,
    SectionComponent,
    QuestionComponent,
    ResponseTypeComponent,
    PreviewComponent,
    IphoneComponent,
    AddLogicComponent,
    HierarchyNodeComponent,
    HierarchyModalComponent,
    HierarchyLocationsListComponent,
    HierarchyAssetsListComponent,
    ShowHierarchyPopupComponent,
    AddFilterComponent,
    ImportQuestionsSliderComponent,
    GlobalResponseTypeSideDrawerComponent,
    BuilderComponent,
    PDFBuilderComponent,
    PDFPreviewComponent,
    QuestionPreviewComponent,
    NgxShimmerLoadingModule,
    NgxShimmerLoadingModule,
    ScheduleSuccessModalComponent,
    ScheduleConfigurationComponent,
    DonutChartComponent,
    IssuesListComponent,
    ActionsListComponent,
    IssuesActionsViewComponent,
    AssignedToComponent,
    ObservationsComponent,
    SchedulersComponent
  ]
})
export class FormModule {}
