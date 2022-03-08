/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable, of, Subscription } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { Dashboard, ErrorInfo } from 'src/app/interfaces';
import { CommonService } from 'src/app/shared/services/common.service';
import { CreateUpdateDashboardDialogComponent } from '../dashboard-create-update-dialog/dashboard-create-update-dialog.component';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog.component';
import { DashboardService } from '../services/dashboard.service';
import { ToastService } from 'src/app/shared/toast';

interface CreateUpdateDeleteDashboard {
  type: 'create' | 'update' | 'delete' | 'mark_default';
  dashboard: Dashboard;
}

interface DashboardData {
  data: Dashboard[]
}

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardsComponent implements OnInit {
  displayAllDashboards = false;
  dashboardMode = 'SINGLE';

  selectedGlobalDashboard: Dashboard;
  dashboardToBeRendered: Dashboard;

  @Input() set selectedDashboard(selectedDashboard: Dashboard) {
    this._selectedDashboard = selectedDashboard;
  }
  get selectedDashboard(): Dashboard {
    return this._selectedDashboard;
  }

  dashboards$: Observable<Dashboard[]>;
  dashboardDataInitial$: Observable<DashboardData>;
  createUpdateDeleteDashboard$ = new BehaviorSubject<CreateUpdateDeleteDashboard>({
    type: 'create',
    dashboard: {} as Dashboard
  });

  private _selectedDashboard: Dashboard;

  staticDropDownOption: Dashboard = ({
    name: 'VIEW_ALL_DASHBOARDS',
    isDefault: false,
    createdBy: 'dummy'
  } as Dashboard);

  constructor(
    private dialog: MatDialog,
    private toast: ToastService,
    private dashboardService: DashboardService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };

    this.dashboardDataInitial$ = of({ data: [] as Dashboard[] });
    this.dashboardDataInitial$ = this.dashboardService.getDashboards$(info).pipe(
      mergeMap((dashboards) => {
        if (dashboards.length) {
          const defaultDashboards: Dashboard[] = dashboards.filter(d => d.isDefault);
          let _defaultDashboard = defaultDashboards[0];
          this.setDefaultDashboard(_defaultDashboard);
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
      catchError(() => of({ data: [] })),
      tap(({ data }) =>
        this.dashboardService.updateDashboards(data)
      ));
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
              this.selectedDashboard = dashboard;
            } else {
              this.selectedGlobalDashboard = dashboard;
              this.displayAllDashboards = false;
            }
            initial.data = initial.data.concat(dashboard);
            return initial.data;
          } else if (type === 'update') {
            initial.data = initial.data.map((db) => {
              if (db.id === dashboard.id) {
                return dashboard;
              }
              return db;
            });
            if (this.dashboardMode === 'ALL') {
              this.displayAllDashboards = true;
              this.selectedDashboard = dashboard;
            } else {
              this.selectedGlobalDashboard = dashboard;
              this.displayAllDashboards = false;
            }
            return initial.data;
          } else if (type === 'delete') {
            initial.data = initial.data.filter((db) => db.id !== dashboard.id);
            let defaultDashboard: Dashboard[] = initial.data.filter(d => d.isDefault);
            const _defaultDashboard: Dashboard = defaultDashboard[0];
            this.selectedDashboard = _defaultDashboard;
            return initial.data;
          } else if (type === 'mark_default') {
            let _defaultDashboard: Dashboard;
            initial.data = initial.data.map((db) => {
              if (db.id === dashboard.id) {
                db.isDefault = true;
                if (this.dashboardMode === 'ALL') {
                  this.selectedDashboard = db;
                } else {
                  this.selectedGlobalDashboard = db;
                }
              } else {
                db.isDefault = false;
              }
              return db;
            });
            return initial.data;
          }
        } else {
          const defaultDashboards: Dashboard[] = initial.data.filter(d => d.isDefault);
          let _defaultDashboard = defaultDashboards[0];
          this.setDefaultDashboard(_defaultDashboard);
          return initial.data;
        }
      })
    );
    this.dashboardService.dashboardSelectionChanged$.subscribe((event) => {
      if (event.name === 'VIEW_ALL_DASHBOARDS') {
        this.displayAllDashboards = true;
        this.dashboardMode = 'ALL';
        this.selectedGlobalDashboard = { ...event };
        let current = [];
        this.dashboards$.subscribe((dashboards) => {
          current = dashboards.filter((d) => d.isDefault);
        });
        this.setSelectedDashboard(current[0]);
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
    let eventVal = event.value;
    if (eventVal.name === 'VIEW_ALL_DASHBOARDS') {
      this.displayAllDashboards = true;
      this.dashboardMode = 'ALL';
      this.selectedGlobalDashboard = { ...eventVal };
      // console.log(this.selectedGlobalDashboard);
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
      height: '250px',
      data: { dialogMode, data: dashboard }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (dialogMode === 'CREATE') {
        if (result && result.name && result.name.length) {
          this.createDashboard(result.name, result.isDefault);
        }
      } else {
        if (result && result.name && result.name.length) {
          this.updateDashboard(result.name, result.isDefault, dashboard);
        }
      }
    });
  }

  createDashboard(name: string, isDefault: boolean = false) {
    this.dashboardService
      .createDashboard$({
        name,
        isDefault,
        createdBy: this.commonService.getUserName()
      })
      .subscribe(
        (response) => {
          this.createUpdateDeleteDashboard$.next({
            type: 'create',
            dashboard: { ...response }
          });
          this.toast.show({
            text: 'Dashboard created successfully',
            type: 'success'
          });
        },
        (err) => {
          this.toast.show({
            text: 'Error occured while creating dashboard',
            type: 'warning'
          });
        }
      );
  }

  updateDashboard(name: string, isDefault: boolean = false, dashboard: Dashboard) {
    dashboard = { ...dashboard, name, isDefault };
    this.dashboardService
      .updateDashboard$(dashboard.id, dashboard)
      .subscribe((response) => {
        this.createUpdateDeleteDashboard$.next({
          type: 'update',
          dashboard: { ...response }
        });
        this.toast.show({
          text: 'Dashboard updated successfully',
          type: 'success'
        });
      }, (err) => {
        this.toast.show({
          text: 'Error occured while updating dashboard',
          type: 'warning'
        });
      });
  }

  deleteDashboard(dashboard: Dashboard) {
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
          }, err => {
            this.toast.show({
              text: 'Error occured while deleting dashboard',
              type: 'warning'
            });
          });
      }
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
      }, (err) => {
        this.toast.show({
          text: 'Error occured while marking dashboard as default',
          type: 'warning'
        });
      });
  }

  createDefaultDashboard = () =>
    this.dashboardService.createDashboard$({
      name: 'Dashboard 1',
      isDefault: true,
      createdBy: this.commonService.getUserName()
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
      case 'MARK_DEFAULT':
        this.markDashboardDefault(data)
    }
  }
}
