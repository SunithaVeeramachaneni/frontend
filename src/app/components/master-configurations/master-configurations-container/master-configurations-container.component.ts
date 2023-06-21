import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { routingUrls } from 'src/app/app.constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { PlantService } from '../plants/services/plant.service';

@Component({
  selector: 'app-master-configurations-container',
  templateUrl: './master-configurations-container.component.html',
  styleUrls: ['./master-configurations-container.component.scss']
})
export class MasterConfigurationsContainerComponent implements OnInit {
  currentRouteUrl$: Observable<string>;
  readonly routingUrls = routingUrls;

  constructor(
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService,
    private cdrf: ChangeDetectorRef,
    private headerService: HeaderService,
    private plantService: PlantService
  ) {}

  ngOnInit(): void {
    this.plantService.getPlantTimeZoneMapping();
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap((currentRouteUrl) => {
        if (currentRouteUrl === routingUrls.masterConfiguration.url) {
          this.headerService.setHeaderTitle(routingUrls.plants.title);
          this.breadcrumbService.set(routingUrls.masterConfiguration.url, {
            skip: true
          });
          this.cdrf.detectChanges();
        } else {
          this.breadcrumbService.set(routingUrls.masterConfiguration.url, {
            skip: false
          });
        }
      })
    );
  }
}
