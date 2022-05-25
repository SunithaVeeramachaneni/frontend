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
import { CollabDialogComponent } from './components/header/CollabDialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PeopleComponent } from './components/header/people/people.component';
import { ChatsComponent } from './components/header/chats/chats.component';
import { CallsComponent } from './components/header/calls/calls.component';
import { UploadDialogComponent } from './components/header/chats/upload-dialog/upload-dialog.component';
import { VideoCallDialogComponent } from './components/header/chats/video-call-dialog/video-call-dialog.component';
import { CreateGroupComponent } from './components/header/chats/create-group/create-group.component';

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
    NumberToKMPipe
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DragDropModule,
    AppMaterialModules,
    BreadcrumbModule,
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
    NumberToKMPipe
  ],
  providers: [DatePipe]
})
export class SharedModule {}
