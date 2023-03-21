import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

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
  counts: {
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
  };
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
      text: '',
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
    series: {
      name: '',
      type: 'pie',
      radius: ['50%', '70%'],
      color: [],
      data: [],
      labelLine: {
        show: true
      }
    },
    indexAxis: 'y',
    isStacked: false,
    showValues: true,
    showLegends: true,
    datasetFieldName: 'name',
    id: '6218ae346589975d09cda19',
    datasetFields: [
      {
        name: 'name',
        displayName: 'Name',
        type: 'string',
        visible: true
      }
    ],
    renderChart: false
  };
  priorityData: any = {
    issues: {},
    actions: {}
  };
  statusData: any = {
    issues: {},
    actions: {}
  };
  private priorityColors = ['#b76262', '#f4a915', '#cfcfcf'];
  private statusColors = ['#B76262', '#C0D7FD'];
  constructor(
    private readonly roundPlanObservationsService: RoundPlanObservationsService
  ) {}

  ngOnInit(): void {
    this.roundPlanObservationsService
      .getObservationChartCounts$()
      .subscribe((result) => {
        if (result) {
          this.priorityData = {
            issues: {
              config: this.prepareGraphConfig(
                result?.openIssues?.priorityTotal,
                this.priorityColors
              ),
              data: this.transformChartPayload(result?.openIssues?.priority)
            },
            actions: {
              config: this.prepareGraphConfig(
                result?.openActions?.priorityTotal,
                this.priorityColors
              ),
              data: this.transformChartPayload(result?.openActions?.priority)
            }
          };
          this.statusData = {
            issues: {
              config: this.prepareGraphConfig(
                result?.openIssues?.statusTotal,
                this.statusColors
              ),
              data: this.transformChartPayload(result?.openIssues?.status)
            },
            actions: {
              config: this.prepareGraphConfig(
                result?.openActions?.statusTotal,
                this.statusColors
              ),
              data: this.transformChartPayload(result?.openActions?.status)
            }
          };
        }
      });
  }

  private transformChartPayload(object) {
    return Object.entries(object).map(([key, value]) => ({
      name: key,
      count: value
    }));
  }

  private prepareGraphConfig(total: number, color: string[]) {
    return {
      ...this.options,
      renderChart: true,
      title: {
        ...this.options.title,
        text: total
      },
      series: {
        ...this.options.series,
        color
      }
    };
  }
}
