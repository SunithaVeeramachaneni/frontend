import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { PeopleComponent } from './components/collaboration/people/people.component';
import { ChatsComponent } from './components/collaboration/chats/chats.component';
import { CreateGroupComponent } from './components/collaboration/chats/create-group/create-group.component';
import { CallsComponent } from './components/collaboration/calls/calls.component';
import { CheckUserHasPermissionDirective } from './directives/check-user-has-permission.directive';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { PermissionsRevokeInfoModalComponent } from './components/permissions-revoke-info-modal/permissions-revoke-info-modal.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { BackgroundComponent } from './components/background/background.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { AcceptCallComponent } from './components/collaboration/calls/accept-call/accept-call.component';
import { VideoCallDialogComponent } from './components/collaboration/calls/video-call-dialog/video-call-dialog.component';
import { AddPeopleToCallComponent } from './components/collaboration/calls/video-call-dialog/add-people-to-call/add-people-to-call.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    AddPeopleToCallComponent,
    PeopleComponent,
    ChatsComponent,
    CreateGroupComponent,
    CallsComponent,
    NumberToKMPipe,
    CheckUserHasPermissionDirective,
    AcceptCallComponent,
    AccessDeniedComponent,
    PermissionsRevokeInfoModalComponent,
    BackgroundComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DragDropModule,
    OverlayModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatBadgeModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    BreadcrumbModule,
    NgxShimmerLoadingModule,
    NgxSpinnerModule,
    TranslateModule.forChild({})
  ],
  exports: [
    NgxSpinnerModule,
    CustomPaginationControlsComponent,
    DummyComponent,
    TimeAgoPipe,
    DropDownFilterPipe,
    DateTimePipe,
    DateSegmentComponent,
    CommonFilterComponent,
    HeaderComponent,
    NumberToKMPipe,
    CheckUserHasPermissionDirective,
    BackgroundComponent
  ],
  providers: [DatePipe]
})
export class SharedModule {}
