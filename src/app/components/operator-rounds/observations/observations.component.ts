import { Observable } from 'zen-observable-ts';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { OperatorRoundsService } from '../services/operator-rounds.service';

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
  constructor(private readonly operatorRoundsService: OperatorRoundsService) {}

  ngOnInit(): void {
    this.counts$ = this.operatorRoundsService.getObservationChartCounts$();
  }
}
