import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkInstructionsPageRoutingModule } from './work-instructions-routing.module';

import { WorkInstructionsPage } from './work-instructions.page';
import { ModalModule } from './modal/modal.module';
import { SharedModule } from '../../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { instructionReducer } from './state/instruction.reducer';
import { NgpSortModule } from 'ngp-sort-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CategoriesComponent } from './categories/categories.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderModule } from 'ngx-order-pipe';
import { AddWorkinstructionComponent } from './add-workinstruction/add-workinstruction.component';
import { CustomStepperComponent, OverviewComponent } from './steps/overview.component';
import { StepContentComponent } from './steps/step-content/step-content.component';
import { CarouselComponent } from './steps/attachment-carousel/carousel.component';
import { QuillMaterialComponent } from './steps/quill-material/quill-material.component';
import { NgCarousel } from './steps/attachment-carousel/ngcarousel.component';
import { IphonePreviewComponent } from './steps/iphone/iphone-preview.component';
import { IpadPreviewComponent } from './steps/ipad/ipad-preview.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgxSlickJsModule } from 'ngx-slickjs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AppMaterialModules } from '../../material.module';
import { DraftsComponent } from './drafts/drafts.component';
import { PublishedComponent } from './published/published.component';
import { RecentsComponent } from './recents/recents.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { CategoryWiseInstructionsComponent } from './category-wise-instructions/category-wise-instructions.component';
import { PlyrModule } from 'ngx-plyr';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PlayerComponent } from './player/player.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    WorkInstructionsPageRoutingModule,
    AppMaterialModules,
    SharedModule,
    ModalModule,
    StoreModule.forFeature('workinstruction', instructionReducer),
    NgpSortModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    OrderModule,
    CdkStepperModule,
    NgxDropzoneModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    PopoverModule.forRoot(),
    PlyrModule,
    NgxSlickJsModule.forRoot({
      links: {
        jquery: 'https://code.jquery.com/jquery-3.4.0.min.js',
        slickJs: 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js',
        slickCss: 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css',
        slickThemeCss: 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css'
      }
    })
  ],
  declarations: [
    WorkInstructionsPage,
    CategoriesComponent,
    AddWorkinstructionComponent,
    OverviewComponent,
    CustomStepperComponent,
    StepContentComponent,
    CarouselComponent,
    QuillMaterialComponent,
    NgCarousel,
    IphonePreviewComponent,
    IpadPreviewComponent,
    DraftsComponent,
    PublishedComponent,
    RecentsComponent,
    FavoritesComponent,
    CategoryWiseInstructionsComponent,
    PlayerComponent
  ]
})
export class WorkInstructionsPageModule {}
