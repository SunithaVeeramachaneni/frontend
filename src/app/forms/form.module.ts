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
import { QuestionComponent } from './components/template/question.component';
import { ResponseTypeComponent } from './components/response-type/response-type.component';
import { PreviewComponent } from './components/preview/preview.component';
import { AddLogicComponent } from './components/add-logic/add-logic.component';
import { AddFilterComponent } from './components/add-filter/add-filter.component';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { ResponseTypeSideDrawerComponent } from './components/response-type-side-drawer/response-type-side-drawer.component';

import { TableComponent } from './components/field-types/table/table.component';
import { ResponseTypeButtonComponent } from './components/response-type-button/response-type-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { ArrayComponent } from './components/field-types/array/array.component';
import { DateComponent } from './components/field-types/date/date.component';
import { TimeComponent } from './components/field-types/time/time.component';
import { ReadOnlyComponent } from './components/field-types/read-only/read-only.component';
import { TextComponent } from './components/field-types/text/text.component';
import { DropDownComponent } from './components/field-types/drop-down/drop-down.component';

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
    ArrayComponent,
    DateComponent,
    TimeComponent,
    ReadOnlyComponent,
    TextComponent,
    DropDownComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
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
    MatTooltipModule,
    TranslateModule.forChild({})
  ],
  exports: [
    FormWidgetComponent,
    PageComponent,
    SectionComponent,
    QuestionComponent,
    ResponseTypeComponent,
    PreviewComponent,
    AddLogicComponent,
    AddFilterComponent
  ]
})
export class FormModule {}
