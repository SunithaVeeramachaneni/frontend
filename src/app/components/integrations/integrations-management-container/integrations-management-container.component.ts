import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { routingUrls } from 'src/app/app.constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-integrations-management-container',
  templateUrl: './integrations-management-container.component.html',
  styleUrls: ['./integrations-management-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntegrationsManagementContainerComponent implements OnInit {
  currentRouteUrl$: Observable<string>;
  readonly routingUrls = routingUrls;

  constructor(
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService,
    private cdrf: ChangeDetectorRef,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap((currentRouteUrl) => {
        if (currentRouteUrl === routingUrls.integrationManagement.url) {
          this.headerService.setHeaderTitle(
            routingUrls.integrationManagement.title
          );
          this.breadcrumbService.set(routingUrls.integrationManagement.url, {
            skip: true
          });
          this.cdrf.detectChanges();
        } else {
          this.breadcrumbService.set(routingUrls.integrationManagement.url, {
            skip: false
          });
        }
      })
    );
  }
}
