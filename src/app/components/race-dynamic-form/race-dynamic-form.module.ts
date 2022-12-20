import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { RaceDynamicFormRoutingModule } from './race-dynamic-form-routing.module';
import { FormModule } from 'src/app/forms/form.module';

import { FormContainerComponent } from './form-container/form-container.component';
import { FormListComponent } from './form-list/form-list.component';
import { FormDetailComponent } from './form-detail/form-detail.component';
import { SubmissionComponent } from './submission/submission.component';
import { ResponseSetComponent } from './response-set/response-set.component';
import { PublicLibraryComponent } from './public-library/public-library.component';
import { FormConfigurationModalComponent } from './form-configuration-modal/form-configuration-modal.component';
import { FormConfigurationComponent } from './form-configuration/form-configuration.component';

import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    FormContainerComponent,
    FormListComponent,
    FormDetailComponent,
    SubmissionComponent,
    ResponseSetComponent,
    PublicLibraryComponent,
    FormConfigurationModalComponent,
    FormConfigurationComponent
  ],
  imports: [
    RaceDynamicFormRoutingModule,
    CommonModule,
    FormModule,
    MatButtonModule
  ]
})
export class RaceDynamicFormModule {
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
