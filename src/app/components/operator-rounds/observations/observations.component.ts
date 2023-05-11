/* eslint-disable @typescript-eslint/naming-convention */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { UsersService } from '../../user-management/services/users.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { UserDetails } from 'src/app/interfaces';
import { routingUrls } from 'src/app/app.constants';
import { ObservationsService } from 'src/app/forms/services/observations.service';

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
  moduleName = 'round-observations';
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
      itemWidth: 15,
      itemHeight: 15,
      padding: [11, 5, 24, 5],
      top: '86%'
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: [25, 40],
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
  users$: Observable<UserDetails[]>;
  currentRouteUrl$: Observable<string>;
  readonly routingUrls = routingUrls;
  constructor(
    private readonly observationsService: ObservationsService,
    private userService: UsersService,
    private headerService: HeaderService,
    private commonService: CommonService,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() =>
        this.headerService.setHeaderTitle(
          routingUrls.roundPlanObservations.title
        )
      )
    );
    this.users$ = this.userService.getUsersInfo$();
    this.observationsService
      .getObservationChartCounts$(this.moduleName)
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
                  ...this.observationsService.prepareColorsAndData(
                    result?.openIssues?.priority,
                    'priority'
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
                  ...this.observationsService.prepareColorsAndData(
                    result?.openActions?.priority,
                    'priority'
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
                  ...this.observationsService.prepareColorsAndData(
                    result?.openIssues?.status,
                    'status'
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
                  ...this.observationsService.prepareColorsAndData(
                    result?.openActions?.status,
                    'status'
                  )
                }
              ]
            }
          };
        }
        this.cdrf.markForCheck();
      });
  }
}
