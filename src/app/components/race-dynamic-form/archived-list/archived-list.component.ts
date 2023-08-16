import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { routingUrls } from 'src/app/app.constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { HeaderService } from 'src/app/shared/services/header.service';

@Component({
  selector: 'app-archived-list',
  templateUrl: './archived-list.component.html',
  styleUrls: ['./archived-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchivedListComponent implements OnInit {
  tabIndex: number;
  currentRouteUrl$: Observable<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ tabIndex }) => {
      this.tabIndex = tabIndex;
    });
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() => {
        this.headerService.setHeaderTitle(routingUrls.archivedForms.title);
      })
    );
  }

  getSelectedIndex(): number {
    return this.tabIndex;
  }

  onTabChange(event: MatTabChangeEvent) {
    this.tabIndex = event.index;
    this.router.navigate(['/forms/archived', this.tabIndex]);
  }
}
