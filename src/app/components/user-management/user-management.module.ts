import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CdkTreeModule } from '@angular/cdk/tree';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementContainerComponent } from './user-management-container/user-management-container.component';
import { RolesPopUpComponent } from './users/roles-pop-up-modal/roles-pop-up-modal.component';
import { AddEditUserModalComponent } from './users/add-edit-user-modal/add-edit-user-modal.component';
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
import { RolesPermissionsComponent } from './roles-permissions/roles-permissions.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { UsersComponent } from './users/users.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UserDeleteModalComponent } from './users/user-delete-modal/user-delete-modal.component';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';

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
    RolesPermissionsComponent,
    RolesPopUpComponent,
    UsersComponent,
    AddEditUserModalComponent,
    PermissionsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
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
