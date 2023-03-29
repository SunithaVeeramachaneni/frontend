import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectTab } from 'src/app/interfaces';
import { HeaderService } from 'src/app/shared/services/header.service';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerComponent implements OnInit, OnDestroy {
  tabIndex: number;
  roundPlanId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ tabIndex }) => {
      this.tabIndex = tabIndex;
    });
    this.headerService.setHeaderTitle('Scheduler');
  }

  getSelectedIndex(): number {
    return this.tabIndex;
  }

  selectTabHandler(event: SelectTab) {
    const {
      index,
      queryParams: { id }
    } = event;
    this.tabIndex = index;
    this.roundPlanId = id;
  }

  onTabChange(event: MatTabChangeEvent) {
    this.tabIndex = event.index;
    if (this.roundPlanId) {
      this.router.navigate(['/forms/scheduler', this.tabIndex], {
        queryParams: { roundPlanId: this.roundPlanId }
      });
    } else {
      this.router.navigate(['/forms/scheduler', this.tabIndex], {
        queryParams: { roundPlanId: null },
        queryParamsHandling: 'merge'
      });
    }
    this.roundPlanId = '';
  }

  ngOnDestroy(): void {}
}
