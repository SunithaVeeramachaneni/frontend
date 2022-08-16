import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OverlayComponent } from './overlay/overlay.component';
import { DeleteCategoryComponent } from './templates/delete-category/delete-category.component';
import { CategoryComponent } from './templates/category/category.component';
import { HttpClientModule } from '@angular/common/http';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AlertComponent } from './alert/alert.component';
import { BulkUploadComponent } from './templates/bulk-upload/bulk-upload.component';
import { CopyInstructionComponent } from './templates/copy-instruction/copy-instruction.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';
import { NgpSortModule } from 'ngp-sort-pipe';
import { StoreModule } from '@ngrx/store';
import { bulkuploadReducer } from './state/bulkupload.reducer';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    OverlayComponent,
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
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    AlertModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    SharedModule,
    FormsModule,
    NgpSortModule,
    NgxSpinnerModule,
    StoreModule.forFeature('bulkupload', bulkuploadReducer)
  ],
  exports: [AlertComponent],
  entryComponents: [
    OverlayComponent,
    DeleteCategoryComponent,
    CategoryComponent,
    BulkUploadComponent,
    CopyInstructionComponent
  ]
})
export class ModalModule {}
