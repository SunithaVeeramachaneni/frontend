import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AppMaterialModules } from '../material.module';
import { CustomPaginationControlsComponent } from './components/custom-pagination-controls/custom-pagination-controls.component';
import { DummyComponent } from './components/dummy/dummy.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { DropDownFilterPipe } from './pipes/dropdown-filter.pipe';
import { HeaderComponent } from './components/header/header.component';
import { CommonFilterComponent } from './components/common-filter/common-filter.component';
import { DateSegmentComponent } from './components/date-segment/date-segment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { DateTimePipe } from './pipes/date-time.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { NumberToKMPipe } from './pipes/number-to-k-m.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { CollabDialogComponent } from './components/collaboration/CollabDialog';
import { UploadDialogComponent } from './components/collaboration/chats/upload-dialog/upload-dialog.component';
import { VideoCallDialogComponent } from './components/collaboration/chats/video-call-dialog/video-call-dialog.component';
import { PeopleComponent } from './components/collaboration/people/people.component';
import { ChatsComponent } from './components/collaboration/chats/chats.component';
import { CreateGroupComponent } from './components/collaboration/chats/create-group/create-group.component';
import { CallsComponent } from './components/collaboration/calls/calls.component';
import { CheckUserHasPermissionDirective } from './directives/check-user-has-permission.directive';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { PermissionsRevokeInfoModalComponent } from './components/permissions-revoke-info-modal/permissions-revoke-info-modal.component';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    CustomPaginationControlsComponent,
    DummyComponent,
    TimeAgoPipe,
    DropDownFilterPipe,
    DateTimePipe,
    DateSegmentComponent,
    CommonFilterComponent,
    HeaderComponent,
    CollabDialogComponent,
    UploadDialogComponent,
    VideoCallDialogComponent,
    PeopleComponent,
    ChatsComponent,
    CreateGroupComponent,
    CallsComponent,
    NumberToKMPipe,
    CheckUserHasPermissionDirective,
    AccessDeniedComponent,
    PermissionsRevokeInfoModalComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DragDropModule,
    OverlayModule,
    AppMaterialModules,
    BreadcrumbModule,
    NgxShimmerLoadingModule,
    TranslateModule.forChild({})
  ],
  exports: [
    CustomPaginationControlsComponent,
    DummyComponent,
    TimeAgoPipe,
    DropDownFilterPipe,
    DateTimePipe,
    DateSegmentComponent,
    CommonFilterComponent,
    HeaderComponent,
    NumberToKMPipe,
    CheckUserHasPermissionDirective
  ],
  providers: [DatePipe]
})
export class SharedModule {}
