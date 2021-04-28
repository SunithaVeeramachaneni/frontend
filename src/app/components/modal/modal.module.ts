
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OverlayComponent } from './overlay/overlay.component';
import { DeleteCategoryComponent } from './templates/delete-category/delete-category.component';
import { CategoryComponent } from './templates/category/category.component';
import { AppMaterialModules } from '../../material.module';
import { HttpClientModule } from '@angular/common/http';
import {UserRegistrationComponent} from './templates/user-registration/user-registration.component';
import {AlertModule} from 'ngx-bootstrap/alert';
import {AlertComponent} from './alert/alert.component';
import { BulkUploadComponent } from './templates/bulk-upload/bulk-upload.component';
import { CopyInstructionComponent } from './templates/copy-instruction/copy-instruction.component';
import {Ng2SearchPipeModule} from "ng2-search-filter";
import {WorkInstructionsModule} from "../workInstructions-home/categories/workinstructions/workinstructions.module";
import {NgxPaginationModule} from "ngx-pagination";
import {SharedModule} from "../../shared/shared.module";
import {NgpSortModule} from 'ngp-sort-pipe';
import { StoreModule } from '@ngrx/store';
import { bulkuploadReducer } from './state/bulkupload.reducer';

@NgModule({
  declarations: [
    OverlayComponent,
    UserRegistrationComponent,
    DeleteCategoryComponent,
    CategoryComponent,
    AlertComponent,
    BulkUploadComponent,
    CopyInstructionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OverlayModule,
    AppMaterialModules,
    HttpClientModule,
    AlertModule,
    Ng2SearchPipeModule,
    WorkInstructionsModule,
    NgxPaginationModule,
    SharedModule,
    FormsModule,
    NgpSortModule,
    StoreModule.forFeature('bulkupload', bulkuploadReducer)
  ],
  exports: [
    AlertComponent
  ],
  entryComponents: [
    OverlayComponent,
    DeleteCategoryComponent,
    CategoryComponent,
    UserRegistrationComponent,
    BulkUploadComponent,
    CopyInstructionComponent
  ]
})
export class ModalModule {}
