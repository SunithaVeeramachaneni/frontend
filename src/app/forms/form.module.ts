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
import { ScheduleSuccessModalComponent } from './components/schedular/schedule-success-modal/schedule-success-modal.component';
import { ScheduleConfigurationComponent } from './components/schedular/schedule-configuration/schedule-configuration.component';
import { AssignToComponent } from './components/schedular/assign/assign.component';
@NgModule({
  declarations: [
    FormWidgetComponent,
    PageComponent,
    SectionComponent,
    QuestionComponent,
    ResponseTypeComponent,
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
    AssignToComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatAutocompleteModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    DragDropModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSliderModule,
    MatChipsModule,
    MatTabsModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatDividerModule,
    MatSelectModule,
    MatTooltipModule,
    MatRadioModule,
    NgxShimmerLoadingModule,
    TranslateModule.forChild({}),
    MatDatepickerModule
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
    NgxShimmerLoadingModule,
    ScheduleSuccessModalComponent,
    ScheduleConfigurationComponent,
    AssignToComponent,
    InstructionImageComponent,
    InstructionPdfComponent
  ]
})
export class FormModule {}
