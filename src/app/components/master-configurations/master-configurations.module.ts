import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TranslateCompiler,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormModule } from 'src/app/forms/form.module';

import { HttpClient } from '@angular/common/http';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { defaultLanguage } from 'src/app/app.constants';
import { DynamictableModule } from '@innovapptive.com/dynamictable';

import { MasterConfigurationsRoutingModule } from './master-configurations-routing.module';
import { MasterConfigurationsContainerComponent } from './master-configurations-container/master-configurations-container.component';
import { LocationsListComponent } from './locations/locations-list/locations-list.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AssetsListComponent } from './assets/assets-list/assets-list.component';
import { UnitMeasurementListComponent } from './unit-measurement/unit-measurement-list/unit-measurement-list.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { LocationDetailViewComponent } from './locations/location-detail-view/location-detail-view.component';
import { AddEditLocationComponent } from './locations/add-edit-location/add-edit-location.component';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { AddEditUnitOfMeasurementComponent } from './unit-measurement/add-edit-uom/add-edit-uom.component';
import { UnitOfMeasurementDetailViewComponent } from './unit-measurement/uom-detail-view/uom-detail-view.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EditUnitPopupComponent } from './unit-measurement/edit-unit-popup/edit-unit-popup.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

export const customTranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(
    http,
    './assets/i18n/master-configurations/',
    '.json'
  );

@NgModule({
  declarations: [
    MasterConfigurationsContainerComponent,
    LocationsListComponent,
    AssetsListComponent,
    UnitMeasurementListComponent,
    LocationDetailViewComponent,
    AddEditLocationComponent,
    AddEditUnitOfMeasurementComponent,
    UnitOfMeasurementDetailViewComponent,
    EditUnitPopupComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MasterConfigurationsRoutingModule,
    CommonModule,
    FormModule,
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
    }),
    DynamictableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    NgxShimmerLoadingModule,
    MatDialogModule,
    MatSlideToggleModule
  ],
  exports: [
    MasterConfigurationsContainerComponent,
    UnitMeasurementListComponent,
    LocationsListComponent,
    AssetsListComponent,
    LocationDetailViewComponent,
    AddEditLocationComponent
  ]
})
export class MasterConfigurationsModule {
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
