/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subscription
} from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Dashboard, ErrorInfo } from 'src/app/interfaces';
import { CreateUpdateDashboardDialogComponent } from '../dashboard-create-update-dialog/dashboard-create-update-dialog.component';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog.component';
import { DashboardService } from '../services/dashboard.service';
import { ToastService } from 'src/app/shared/toast';
import { AlertDialog } from '../alert-dialog/alert-dialog.component';
import { permissions } from 'src/app/app.constants';
import { LoginService } from '../../login/services/login.service';

interface CreateUpdateDeleteDashboard {
  type: 'create' | 'update' | 'delete' | 'mark_default' | 'copy';
  dashboard: Dashboard;
}

interface DashboardData {
  data: Dashboard[];
}

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardsComponent implements OnInit, OnDestroy {
  displayAllDashboards = false;
  dashboardMode = 'SINGLE';
  selectedGlobalDashboard: Dashboard;
  selectedDashboard: Dashboard;
  defaultDashboard: Dashboard;
  skipSetDefaultDashboard = false;
  dashboards$: Observable<Dashboard[]>;
  dashboardDataInitial$: Observable<DashboardData>;
  createUpdateDeleteDashboard$ =
    new BehaviorSubject<CreateUpdateDeleteDashboard>({
      type: 'create',
      dashboard: {} as Dashboard
    });
  staticDropDownOption: Dashboard = {
    id: 'VIEW_ALL_DASHBOARDS',
    name: 'VIEW_ALL_DASHBOARDS',
    isDefault: false,
    createdBy: 'dummy'
  } as Dashboard;
  readonly permissions = permissions;

  private dashboardSelectionChangedSubscription: Subscription;

  constructor(
    private dialog: MatDialog,
    private toast: ToastService,
    private dashboardService: DashboardService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };

    this.dashboardDataInitial$ = of({ data: [] as Dashboard[] });
    this.dashboardDataInitial$ = this.dashboardService
      .getDashboards$(info)
      .pipe(
        mergeMap((dashboards) => {
          if (dashboards.length) {
            return of({ data: dashboards });
          } else {
            return this.createDefaultDashboard().pipe(
              map((dashboard) => {
                if (Object.keys(dashboard).length) {
                  return { data: [dashboard] };
                } else {
                  return { data: [] };
                }
              })
            );
          }
        }),
        catchError(() => of({ data: [] }))
      );

    this.dashboards$ = combineLatest([
      this.dashboardDataInitial$,
      this.createUpdateDeleteDashboard$
    ]).pipe(
      map(([initial, dashboardAction]) => {
        const { type, dashboard } = dashboardAction;
        if (Object.keys(dashboard).length) {
          if (type === 'create') {
            if (this.dashboardMode === 'ALL') {
              this.displayAllDashboards = true;
            } else {
              this.selectedGlobalDashboard = dashboard;
              this.displayAllDashboards = false;
            }
            this.selectedDashboard = dashboard;
            this.skipSetDefaultDashboard = true;
            if (dashboard.isDefault) {
              initial.data = initial.data.map((db) => {
                db.isDefault = false;
                return db;
              });
            }
            initial.data = initial.data.concat(dashboard);
            return initial.data;
          } else if (type === 'update') {
            initial.data = initial.data.map((db) => {
              if (db.id === dashboard.id) {
                return dashboard;
              }
              if (dashboard.isDefault) {
                db.isDefault = false;
              }
              return db;
            });
            if (this.dashboardMode === 'ALL') {
              this.displayAllDashboards = true;
              this.selectedDashboard = dashboard;
            } else {
              this.selectedGlobalDashboard = dashboard;
              this.selectedDashboard = dashboard;
              this.displayAllDashboards = false;
            }
            this.skipSetDefaultDashboard = true;
            return initial.data;
          } else if (type === 'delete') {
            initial.data = initial.data.filter((db) => db.id !== dashboard.id);
            this.skipSetDefaultDashboard = false;
            return initial.data;
          } else if (type === 'mark_default') {
            initial.data = initial.data.map((db) => {
              if (db.id === dashboard.id) {
                db.isDefault = true;
                if (this.dashboardMode === 'ALL') {
                  this.selectedDashboard = { ...db };
                } else {
                  this.selectedGlobalDashboard = db;
                }
              } else {
                db.isDefault = false;
              }
              return db;
            });
            this.skipSetDefaultDashboard = true;
            return initial.data;
          } else if (type === 'copy') {
            initial.data.push(dashboard);
            this.skipSetDefaultDashboard = true;
            this.selectedDashboard = { ...dashboard };
            return initial.data;
          }
        } else {
          return initial.data;
        }
      }),
      tap((dashboards) => {
        this.dashboardService.updateDashboards(dashboards);
        this.defaultDashboard = dashboards.find(
          (dashboard) => dashboard.isDefault
        );
        if (!this.skipSetDefaultDashboard) {
          this.setDefaultDashboard(this.defaultDashboard);
        }
      })
    );

    this.dashboardSelectionChangedSubscription =
      this.dashboardService.dashboardSelectionChanged$.subscribe((event) => {
        if (event.name === 'VIEW_ALL_DASHBOARDS') {
          this.displayAllDashboards = true;
          this.dashboardMode = 'ALL';
          this.selectedGlobalDashboard = { ...event };
          this.setSelectedDashboard(this.defaultDashboard);
        } else if (event.name === 'CREATE_DASHBOARD') {
          this.openCreateDashboardDialog();
        } else {
          this.selectedGlobalDashboard = event;
          this.selectedDashboard = event;
          this.displayAllDashboards = false;
        }
      });
  }

  setDefaultDashboard(dashboard: Dashboard) {
    if (this.dashboardMode === 'ALL') {
      this.selectedDashboard = { ...dashboard };
    } else {
      this.selectedDashboard = { ...dashboard };
      this.selectedGlobalDashboard = { ...dashboard };
    }
  }

  setSelectedDashboard(dashboard: Dashboard) {
    this.selectedDashboard = dashboard;
    this.displayAllDashboards = true;
  }

  globalDashboardSelectionChanged(event: any) {
    const eventVal = event.value;
    if (eventVal.name === 'VIEW_ALL_DASHBOARDS') {
      this.displayAllDashboards = true;
      this.dashboardMode = 'ALL';
      this.selectedGlobalDashboard = { ...eventVal };
    } else {
      this.displayAllDashboards = false;
      this.dashboardMode = 'SINGLE';
      this.selectedGlobalDashboard = eventVal;
      this.selectedDashboard = eventVal;
      this.dashboardService.dashboardSelectionChanged(eventVal);
    }
    this.dashboardService.updateGridOptions({
      update: true,
      subtractWidth: 150
    });
  }

  openCreateDashboardDialog(
    dialogMode: string = 'CREATE',
    dashboard?: Dashboard
  ): void {
    const dialogRef = this.dialog.open(CreateUpdateDashboardDialogComponent, {
      disableClose: true,
      width: '400px',
      height: '350px',
      data: { dialogMode, data: dashboard }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (dialogMode === 'CREATE') {
        if (result && result.name && result.name.length) {
          this.createDashboard(
            result.name,
            result.moduleName,
            result.isDefault
          );
        }
      } else {
        if (result && result.name && result.name.length) {
          this.updateDashboard(
            result.name,
            result.moduleName,
            result.isDefault,
            dashboard
          );
        }
      }
    });
  }

  createDashboard(
    name: string,
    moduleName: string,
    isDefault: boolean = false
  ) {
    this.dashboardService
      .createDashboard$({
        name,
        moduleName,
        isDefault,
        createdBy: this.loginService.getLoggedInUserName()
      })
      .subscribe(
        (response) => {
          if (response && Object.keys(response).length) {
            this.createUpdateDeleteDashboard$.next({
              type: 'create',
              dashboard: { ...response }
            });
            this.toast.show({
              text: 'Dashboard created successfully',
              type: 'success'
            });
          }
        },
        (err) => {
          this.toast.show({
            text: 'Error occured while creating dashboard',
            type: 'warning'
          });
        }
      );
  }

  updateDashboard(
    name: string,
    moduleName: string,
    isDefault: boolean = false,
    dashboard: Dashboard
  ) {
    dashboard = { ...dashboard, name, isDefault, moduleName };
    this.dashboardService
      .updateDashboard$(dashboard.id, dashboard)
      .subscribe((response) => {
        if (response && Object.keys(response).length) {
          this.createUpdateDeleteDashboard$.next({
            type: 'update',
            dashboard: { ...response }
          });
          this.toast.show({
            text: 'Dashboard updated successfully',
            type: 'success'
          });
        }
      });
  }

  deleteDashboard(dashboard: Dashboard) {
    if (dashboard.isDefault) {
      this.dialog.open(AlertDialog, {
        disableClose: true,
        width: '500px',
        height: '190px'
      });
      return;
    }

    const deleteReportRef = this.dialog.open(ConfirmDialog, {
      data: {}
    });
    deleteReportRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.dashboardService
          .deleteDashboard$(dashboard.id)
          .subscribe((response) => {
            this.createUpdateDeleteDashboard$.next({
              type: 'delete',
              dashboard: { ...dashboard }
            });
            this.toast.show({
              text: 'Dashboard deleted successfully',
              type: 'success'
            });
          });
      }
    });
  }

  copyDashboard(dashboard: Dashboard) {
    this.dashboardService.copyDashboard$(dashboard).subscribe((response) => {
      this.createUpdateDeleteDashboard$.next({
        type: 'copy',
        dashboard: { ...response }
      });
      this.toast.show({
        text: 'Dashboard copied successfully',
        type: 'success'
      });
    });
  }

  markDashboardDefault(dashboard: Dashboard) {
    this.dashboardService
      .markDashboardDefault$(dashboard.id, dashboard)
      .subscribe((response) => {
        this.createUpdateDeleteDashboard$.next({
          type: 'mark_default',
          dashboard: { ...dashboard }
        });
        this.toast.show({
          text: 'Dashboard marked default successfully',
          type: 'success'
        });
      });
  }

  createDefaultDashboard = () =>
    this.dashboardService.createDashboard$({
      name: 'Dashboard 1',
      isDefault: true,
      createdBy: this.loginService.getLoggedInUserName()
    });

  handleDashboardActions(event) {
    if (!event) return;
    const { type, data } = event;
    switch (type) {
      case 'EDIT':
        this.openCreateDashboardDialog('EDIT', data);
        break;
      case 'DELETE':
        this.deleteDashboard(data);
        break;
      case 'MARK_DEFAULT':
        this.markDashboardDefault(data);
        break;
      case 'COPY':
        this.copyDashboard(data);
    }
  }

  compareFn(option1: Dashboard, option2: Dashboard) {
    return option1.name === option2.name;
  }

  ngOnDestroy(): void {
    if (this.dashboardSelectionChangedSubscription) {
      this.dashboardSelectionChangedSubscription.unsubscribe();
    }
  }
}
