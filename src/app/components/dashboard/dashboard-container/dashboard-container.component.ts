import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { routingUrls } from 'src/app/app.constants';
import { Dashboard } from 'src/app/interfaces';
import { CommonService } from 'src/app/shared/services/common.service';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardContainerComponent implements OnInit {
  headerTitle = 'Dashboard';
  dashboardTab: FormControl;
  dashboardTab$: Observable<string>;
  selectedDashboard: Dashboard;
  currentRouteUrl$: Observable<string>;
  readonly routingUrls = routingUrls;
  dashboards$: Observable<Dashboard[]>;
  headerTitle$: Observable<string>;

  constructor(
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap((currentRouteUrl) => {
        if (currentRouteUrl === routingUrls.dashboard.url) {
          this.commonService.setHeaderTitle(routingUrls.dashboard.title);
          this.breadcrumbService.set(routingUrls.dashboard.url, { skip: true });
        } else {
          this.breadcrumbService.set(routingUrls.dashboard.url, {
            skip: false
          });
        }
      })
    );
    this.headerTitle$ = this.commonService.headerTitleAction$;
  }
}
