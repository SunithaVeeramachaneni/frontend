import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';
import { WorkInstructionsComponent } from './workinstructions.component';
import {OverviewComponent, CustomStepperComponent} from './steps/overview.component';
import {AppMaterialModules} from '../../../../material.module';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { AddWorkinstructionComponent } from './add-workinstruction/add-workinstruction.component';
import {AppRoutingModule} from '../../../../app-routing.module';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';
import { OrderModule } from 'ngx-order-pipe';
import {NgpSortModule} from 'ngp-sort-pipe';

import { StepContentComponent } from './steps/step-content/step-content.component';
import { CarouselComponent } from './steps/attachment-carousel/carousel.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { QuillMaterialComponent } from './steps/quill-material/quill-material.component';
import { SharedModule } from '../../../../shared/shared.module';
import { NgCarousel } from './steps/attachment-carousel/ngcarousel.component';
import {  NgxSlickJsModule } from 'ngx-slickjs';
import { IphonePreviewComponent } from './steps/iphone/iphone-preview.component';
import { IpadPreviewComponent } from './steps/ipad/ipad-preview.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { StoreModule } from '@ngrx/store';
import { instructionReducer } from './state/instruction.reducer';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChartsModule,
        BsDropdownModule,
        ButtonsModule.forRoot(),
        AppMaterialModules,
        ReactiveFormsModule,
        CdkStepperModule,
        AppRoutingModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
        NgpSortModule,
        OrderModule,
        NgxSpinnerModule,
        SharedModule,
        NgxDropzoneModule,
        NgxSlickJsModule.forRoot({
          links: {
            jquery: "https://code.jquery.com/jquery-3.4.0.min.js",
            slickJs: "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js",
            slickCss: "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css",
            slickThemeCss: "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css"
          }
      }),
      StoreModule.forFeature('workinstruction', instructionReducer)
    ],
  declarations: [
 
    WorkInstructionsComponent,
    OverviewComponent,
    CustomStepperComponent,
    AddWorkinstructionComponent,
    StepContentComponent,
    CarouselComponent,
    QuillMaterialComponent,
    NgCarousel,
    IphonePreviewComponent,
    IpadPreviewComponent
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ]

})
export class WorkInstructionsModule {


}
