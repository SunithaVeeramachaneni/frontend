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
import { RoundPlanConfigurationModalComponent } from '../round-plan-header-configuration/round-plan-header-configuration.component';
import { PlantService } from '../../master-configurations/plants/services/plant.service';

@Component({
  selector: 'app-operator-rounds-container',
  templateUrl: './operator-rounds-container.component.html',
  styleUrls: ['./operator-rounds-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperatorRoundsContainerComponent implements OnInit {
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
        if (currentRouteUrl === routingUrls.operatorRoundPlans.url) {
          this.headerService.setHeaderTitle(routingUrls.myRoundPlans.title);
          this.breadcrumbService.set(routingUrls.operatorRoundPlans.url, {
            skip: true
          });
          this.cdrf.detectChanges();
        } else {
          this.breadcrumbService.set(routingUrls.operatorRoundPlans.url, {
            skip: false
          });
        }
      })
    );
  }

  openRoundPlanCreationModal() {
    this.dialog.open(RoundPlanConfigurationModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal'
    });
  }
}
