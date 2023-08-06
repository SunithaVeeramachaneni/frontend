import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { routingUrls } from 'src/app/app.constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { FormListComponent } from '../form-list/form-list.component';
import { CreateAiFormModalComponent } from '../create-ai-form-modal/create-ai-form-modal.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormContainerComponent implements OnInit {
  currentRouteUrl$: Observable<string>;
  readonly routingUrls = routingUrls;
  @ViewChild(FormListComponent) formListComponent: FormListComponent;

  constructor(
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService,
    private cdrf: ChangeDetectorRef,
    private headerService: HeaderService,
    private plantService: PlantService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.plantService.getPlantTimeZoneMapping();
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap((currentRouteUrl) => {
        if (currentRouteUrl === routingUrls.raceDynamicForms.url) {
          this.headerService.setHeaderTitle(routingUrls.myForms.title);
          this.breadcrumbService.set(routingUrls.raceDynamicForms.url, {
            skip: true
          });
          this.cdrf.detectChanges();
        } else {
          this.breadcrumbService.set(routingUrls.raceDynamicForms.url, {
            skip: false
          });
        }
      })
    );
  }

  openFormCreationModal(data: any) {
    this.formListComponent.openFormCreationModal({ isCreateAI: false });
  }

  uploadFile(event, formType) {
    this.formListComponent.uploadFile(event, formType);
  }

  resetFile(event) {
    this.formListComponent.resetFile(event);
  }
  openCreateAIFormsModal() {
    this.formListComponent.openFormCreationModal({ isCreateAI: true });
  }
}
