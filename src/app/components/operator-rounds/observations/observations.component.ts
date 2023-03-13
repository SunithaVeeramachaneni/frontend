import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { RoundPlanObservationsService } from '../services/round-plan-observation.service';

interface IPriority {
  high: number;
  medium: number;
  low: number;
  total: number;
}
@Component({
  selector: 'app-observations',
  templateUrl: './observations.component.html',
  styleUrls: ['./observations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObservationsComponent implements OnInit {
  counts$: Observable<{
    openActions: {
      priority: IPriority;
      status: {
        toDo: number;
        inProgress: number;
        total: number;
      };
    };
    openIssues: {
      priority: IPriority;
      status: {
        open: number;
        inProgress: number;
        total: number;
      };
    };
  }>;
  constructor(
    private readonly roundPlanObservationsService: RoundPlanObservationsService
  ) {}

  ngOnInit(): void {
    this.counts$ =
      this.roundPlanObservationsService.getObservationChartCounts$();
  }
}
