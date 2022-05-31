import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CdkTreeModule } from '@angular/cdk/tree';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementContainerComponent } from './user-management-container/user-management-container.component';
import { AddEditUserModalComponent } from './add-edit-user-modal/add-edit-user-modal.component';
import { SharedModule } from '../../shared/shared.module';
import { AppMaterialModules } from '../../material.module';
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

export const customTranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/user-management/', '.json');

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CdkTreeModule,
    UserManagementRoutingModule,
    CommonModule,
    SharedModule,
    DynamictableModule,
    AppMaterialModules,
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
    InactiveUsersComponent
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
