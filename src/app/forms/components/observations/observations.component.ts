/* eslint-disable @typescript-eslint/naming-convention */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input
} from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HeaderService } from 'src/app/shared/services/header.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { UserDetails, UserInfo } from 'src/app/interfaces';
import { routingUrls } from 'src/app/app.constants';
import { ObservationsService } from 'src/app/forms/services/observations.service';
import { UsersService } from 'src/app/components/user-management/services/users.service';
import { PlantService } from 'src/app/components/master-configurations/plants/services/plant.service';
import { LoginService } from 'src/app/components/login/services/login.service';

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
  @Input() moduleName: string;
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
      bottom: 0
    },
    series: [
      {
        name: '',
        type: 'pie',
        top: '-20%',
        left: '-20%',
        right: '-20%',
        bottom: '-20%',
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
  isNotificationAlert = false;
  userInfo$: Observable<UserInfo>;
  readonly routingUrls = routingUrls;
  private plantId = null;
  constructor(
    private readonly observationsService: ObservationsService,
    private userService: UsersService,
    private headerService: HeaderService,
    private commonService: CommonService,
    private cdrf: ChangeDetectorRef,
    private plantService: PlantService,
    private readonly loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.plantService.getPlantTimeZoneMapping();
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() =>
        this.headerService.setHeaderTitle(
          routingUrls.roundPlanObservations.title
        )
      )
    );
    this.users$ = this.userService.getUsersInfo$();
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ plantId = null }) => {
        this.plantService.setUserPlantIds(plantId);
        this.observationsService
          .getObservationChartCounts$(this.moduleName, {
            plant: plantId
          })
          .subscribe();
      })
    );

    this.observationsService.observationChartCounts$.subscribe((result) => {
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
