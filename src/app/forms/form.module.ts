import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormWidgetComponent } from './components/form-widget/form-widget.component';
import { PageComponent } from './components/page/page.component';
import { SectionComponent } from './components/section/section.component';
import { TemplateComponent } from './components/template/template.component';
import { ResponseTypeComponent } from './components/response-type/response-type.component';
import { PreviewComponent } from './components/preview/preview.component';
import { AddLogicComponent } from './components/add-logic/add-logic.component';
import { AddFilterComponent } from './components/add-filter/add-filter.component';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    FormWidgetComponent,
    PageComponent,
    SectionComponent,
    TemplateComponent,
    ResponseTypeComponent,
    PreviewComponent,
    AddLogicComponent,
    AddFilterComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatMenuModule
  ],
  exports: [
    FormWidgetComponent,
    PageComponent,
    SectionComponent,
    TemplateComponent,
    ResponseTypeComponent,
    PreviewComponent,
    AddLogicComponent,
    AddFilterComponent
  ]
})
export class FormModule {}
