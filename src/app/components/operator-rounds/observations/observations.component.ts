import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { AppChartConfig } from 'src/app/interfaces';
import { EChartsOption } from 'echarts';

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
  options = {
    avoidLabelOverlap: true,
    label: {
      show: true,
      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
      formatter(param: any) {
        return param?.value;
      }
    },
    title: {
      text: '10',
      subtext: '',
      left: 'center',
      top: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'horizontal',
      top: '90%'
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['50%', '70%'],
        color: ['#b76262', '#f4a915', '#cfcfcf'],
        data: [
          { value: 7, name: 'High' },
          { value: 2, name: 'Medium' },
          { value: 1, name: 'Low' }
        ],
        labelLine: {
          show: true
        }
      }
    ]
  };
  priorityData: any = {};
  statusData: any = {};
  constructor(
    private readonly roundPlanObservationsService: RoundPlanObservationsService
  ) {
    this.priorityData = { ...this.options };
    this.statusData = {
      ...this.options,
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['50%', '70%'],
          color: ['#B76262', '#C0D7FD'],
          data: [
            { value: 7, name: 'To do' },
            { value: 3, name: 'In Progress' }
          ],
          labelLine: {
            show: true
          }
        }
      ]
    };
  }

  ngOnInit(): void {
    this.counts$ =
      this.roundPlanObservationsService.getObservationChartCounts$();
  }
}
