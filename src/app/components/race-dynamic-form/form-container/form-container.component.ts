import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { routingUrls } from 'src/app/app.constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FormConfigurationModalComponent } from '../form-configuration-modal/form-configuration-modal.component';
import { CreateFromTemplateModalComponent } from '../create-from-template-modal/create-from-template-modal.component';
import { PlantService } from '../../master-configurations/plants/services/plant.service';

@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormContainerComponent implements OnInit {
  currentRouteUrl$: Observable<string>;
  readonly routingUrls = routingUrls;

  constructor(
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService,
    private cdrf: ChangeDetectorRef,
    private headerService: HeaderService,
    private dialog: MatDialog,
    private plantService: PlantService
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
    this.dialog.open(FormConfigurationModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      data
    });
  }

  openCreateFromTemplateModal() {
    const dialogRef = this.dialog.open(CreateFromTemplateModalComponent, {});
    dialogRef.afterClosed().subscribe((data) => {
      if (data.selectedTemplate) {
        this.openFormCreationModal(data.selectedTemplate);
      }
    });
  }
}
