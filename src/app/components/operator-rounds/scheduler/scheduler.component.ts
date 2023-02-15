import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HeaderService } from 'src/app/shared/services/header.service';
import { OperatorRoundsService } from '../services/operator-rounds.service';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerComponent implements OnInit, OnDestroy {
  tabIndex: number;
  openBasicScheduler$: Observable<boolean>;
  roundPlanDetails$: Observable<any>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private operatorRoundsService: OperatorRoundsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ tabIndex }) => {
      this.tabIndex = tabIndex;
    });
    this.headerService.setHeaderTitle('Scheduler');
    this.openBasicScheduler$ =
      this.operatorRoundsService.roundPlanSchedulerConfigurationAction$;
    this.roundPlanDetails$ = this.operatorRoundsService.roundPlanDetailsAction$;
  }

  getSelectedIndex(): number {
    return this.tabIndex;
  }

  onTabChange(event: MatTabChangeEvent) {
    this.tabIndex = event.index;
    this.router.navigate(['/operator-rounds/scheduler', this.tabIndex]);
  }

  ngOnDestroy(): void {
    this.operatorRoundsService.openRoundPlanSchedulerConfiguration(false);
  }
}
