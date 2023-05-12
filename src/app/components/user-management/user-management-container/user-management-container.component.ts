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
  selector: 'app-user-management-container',
  templateUrl: './user-management-container.component.html',
  styleUrls: ['./user-management-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserManagementContainerComponent implements OnInit {
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
        if (currentRouteUrl === routingUrls.userManagement.url) {
          this.headerService.setHeaderTitle(routingUrls.activeUsers.title);
          this.breadcrumbService.set(routingUrls.userManagement.url, {
            skip: true
          });
          this.cdrf.detectChanges();
        } else {
          this.breadcrumbService.set(routingUrls.userManagement.url, {
            skip: false
          });
        }
      })
    );
  }
}
