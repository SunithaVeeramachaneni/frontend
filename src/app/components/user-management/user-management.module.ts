import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CdkTreeModule } from '@angular/cdk/tree';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementContainerComponent } from './user-management-container/user-management-container.component';
import { AddEditUserModalComponent } from './add-edit-user-modal/add-edit-user-modal.component';
import { SharedModule } from '../../shared/shared.module';
import {
  TranslateCompiler,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { DynamictableModule } from '@innovapptive.com/dynamictable';
import { HttpClient } from '@angular/common/http';
import { defaultLanguage } from 'src/app/app.constants';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { RolesComponent } from './roles/roles.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { UsersComponent } from './users/users.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UserDeleteModalComponent } from './user-delete-modal/user-delete-modal.component';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { CancelModalComponent } from './cancel-modal/cancel-modal.component';
import { RoleDeleteModalComponent } from './role-delete-modal/role-delete-modal.component';
import { InactiveUsersComponent } from './inactive-users/inactive-users.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UserGroupListComponent } from './user-group-list/user-group-list.component';
import { AddEditUserGroupModalComponent } from './add-edit-user-group-modal/add-edit-user-group-modal.component';
import { SelectUserUsergroupModalComponent } from './select-user-usergroup-modal/select-user-usergroup-modal.component';
import { UserGroupUsersListComponent } from './user-group-users-list/user-group-users-list.component';
import { UserGroupDeleteModalComponent } from './user-group-delete-modal/user-group-delete-modal.component';

export const customTranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/user-management/', '.json');

@NgModule({
  imports: [
    ReactiveFormsModule,
    CdkTreeModule,
    UserManagementRoutingModule,
    CommonModule,
    SharedModule,
    DynamictableModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    OverlayModule,
    MatListModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    NgxShimmerLoadingModule,
    NgxSpinnerModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: customTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true,
      defaultLanguage,
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler
      }
    })
  ],
  declarations: [
    UserManagementContainerComponent,
    UserDeleteModalComponent,
    RolesComponent,
    UsersComponent,
    AddEditUserModalComponent,
    PermissionsComponent,
    CancelModalComponent,
    RoleDeleteModalComponent,
    InactiveUsersComponent,
    UserGroupListComponent,
    AddEditUserGroupModalComponent,
    SelectUserUsergroupModalComponent,
    UserGroupUsersListComponent,
    UserGroupDeleteModalComponent
  ],
  schemas: [],
  providers: [],
  exports: [],
  entryComponents: []
})
export class UserManagementModule {
  constructor(
    public translateService: TranslateService,
    public commonService: CommonService
  ) {
    this.translateService.store.onLangChange.subscribe((translate) => {
      this.translateService.use(translate.lang);
    });
    this.commonService.translateLanguageAction$.subscribe((lang) => {
      this.translateService.use(lang);
    });
  }
}
