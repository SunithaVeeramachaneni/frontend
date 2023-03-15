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
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['50%', '70%'],
        color: [],
        data: [],
        labelLine: {
          show: true
        }
      }
    ]
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
              ...this.options,
              title: {
                ...this.options.title,
                text: result?.openIssues?.priorityTotal
              },
              series: [
                {
                  ...this.options.series[0],
                  color: this.priorityColors,
                  data: Object.entries(result?.openIssues?.priority).map(
                    ([key, value]) => ({
                      name: key,
                      value
                    })
                  )
                }
              ]
            },
            actions: {
              ...this.options,
              title: {
                ...this.options.title,
                text: result?.openActions?.priorityTotal
              },
              series: [
                {
                  ...this.options.series[0],
                  color: this.priorityColors,
                  data: Object.entries(result?.openActions?.priority).map(
                    ([key, value]) => ({
                      name: key,
                      value
                    })
                  )
                }
              ]
            }
          };

          this.statusData = {
            issues: {
              ...this.options,
              title: {
                ...this.options.title,
                text: result?.openIssues?.statusTotal
              },
              series: [
                {
                  ...this.options.series[0],
                  color: this.statusColors,
                  data: Object.entries(result?.openIssues?.status).map(
                    ([key, value]) => ({
                      name: key,
                      value
                    })
                  )
                }
              ]
            },
            actions: {
              ...this.options,
              title: {
                ...this.options.title,
                text: result?.openActions?.statusTotal
              },
              series: [
                {
                  ...this.options.series[0],
                  color: this.statusColors,
                  data: Object.entries(result?.openActions?.status).map(
                    ([key, value]) => ({
                      name: key,
                      value
                    })
                  )
                }
              ]
            }
          };
        }
      });
  }
}