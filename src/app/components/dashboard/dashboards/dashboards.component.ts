/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { Dashboard, ErrorInfo } from 'src/app/interfaces';
import { CommonService } from 'src/app/shared/services/common.service';
import { CreateUpdateDashboardDialogComponent } from '../dashboard-create-update-dialog/dashboard-create-update-dialog.component';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog.component';
import { DashboardService } from '../services/dashboard.service';
import { ToastService } from 'src/app/shared/toast';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardsComponent implements OnInit {
  displayAllDashboards = false;
  dashboardMode = 'SINGLE';

  @Input() set selectedGlobalDashboard(selectedGlobalDashboard: Dashboard) {
    this._selectedGlobalDashboard = selectedGlobalDashboard;
  }
  get selectedGlobalDashboard(): Dashboard {
    return this._selectedGlobalDashboard;
  }

  @Input() set selectedDashboard(selectedDashboard: Dashboard) {
    this._selectedDashboard = selectedDashboard;
  }
  get selectedDashboard(): Dashboard {
    return this._selectedDashboard;
  }

  dashboards$: Observable<Dashboard[]>;
  private _selectedGlobalDashboard: Dashboard;
  private _selectedDashboard: Dashboard;

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
    this.dashboards$ = this.dashboardService.getDashboards$(info).pipe(
      mergeMap((dashboards) => {
        if (dashboards.length) {
          this.setDefaultDashboard(dashboards);
          return of(dashboards);
        } else {
          return this.createDefaultDashboard().pipe(
            map((dashboard) => {
              if (Object.keys(dashboard).length) {
                return [dashboard];
              } else {
                return [];
              }
            })
          );
        }
      }),
      catchError(() => of([])),
      tap(this.dashboardService.updateDashboards)
    );

    this.dashboardService.dashboardSelectionChanged$.subscribe((event) => {
      if (event === 'VIEW_ALL_DASHBOARDS') {
        this.displayAllDashboards = true;
        this.dashboardMode = 'ALL';
        this.selectedGlobalDashboard = event;
        let current = [];
        this.dashboards$.subscribe((dashboards) => {
          current = dashboards.filter((d) => d.isDefault);
        });
        this.setSelectedDashboard(current[0]);
      } else if (event === 'CREATE_DASHBOARD') {
        this.openCreateDashboardDialog();
      } else {
        this.selectedGlobalDashboard = event;
        this.displayAllDashboards = false;
      }
    });
  }

  setDefaultDashboard(dashboards: Dashboard[]) {
    const current = dashboards.filter(d => d.isDefault);
    this.selectedDashboard = current[0];
    this.selectedGlobalDashboard = current[0];
  }

  setSelectedDashboard(dashboard: Dashboard) {
    this.selectedDashboard = dashboard;
    this.displayAllDashboards = true;
  }

  globalDashboardSelectionChanged(event: any) {
    if (event === 'VIEW_ALL_DASHBOARDS') {
      this.displayAllDashboards = true;
      this.dashboardMode = 'ALL';
      this.selectedGlobalDashboard = event;
      let current = [];
      this.dashboards$.subscribe(dashboards => {
        current = dashboards.filter(d => d.isDefault);
      });
      this.setSelectedDashboard(current[0]);
    } else {
      this.dashboardMode = 'SINGLE';
      const dashboardSelectionVal = event.value;
      this.selectedGlobalDashboard = dashboardSelectionVal;
      this.selectedDashboard = dashboardSelectionVal;
      this.displayAllDashboards = false;
      this.dashboardService.dashboardSelectionChanged(dashboardSelectionVal);
    }


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
          this.dashboards$.pipe(take(1)).subscribe((data) => {
            this.dashboards$ = of(data);
            if (this.dashboardMode === 'ALL') {
              this.displayAllDashboards = true;
              this.selectedDashboard = data[data.length - 1];
            } else {
              this.selectedGlobalDashboard = data[data.length - 1];
              this.displayAllDashboards = false;
            }
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
        this.dashboards$.pipe(take(1)).subscribe((data) => {
          this.dashboards$ = of(data);
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
            this.dashboards$.pipe(take(1)).subscribe((data) => {
              this.dashboards$ = of(data);
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
        this.dashboards$.pipe(take(1)).subscribe((data) => {
          this.dashboards$ = of(data);
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
}
