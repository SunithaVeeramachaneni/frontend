/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  CompactType,
  DisplayGrid,
  Draggable,
  GridsterComponent,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponent,
  GridType,
  PushDirections,
  Resizable
} from 'angular-gridster2';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, combineLatest, interval, Observable, of } from 'rxjs';
import {
  filter,
  map,
  mergeMap,
  startWith,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import { permissions } from 'src/app/app.constants';
import {
  Dashboard,
  Widget,
  WidgetAction,
  WidgetsData
} from 'src/app/interfaces';
import { ToastService } from 'src/app/shared/toast';
import { DashboardService } from '../services/dashboard.service';
import { WidgetService } from '../services/widget.service';
import { WidgetConfigurationModalComponent } from '../widget-configuration-modal/widget-configuration-modal.component';
import { WidgetDeleteModalComponent } from '../widget-delete-modal/widget-delete-modal.component';
interface GridInterface extends GridsterConfig {
  draggable: Draggable;
  resizable: Resizable;
  pushDirections: PushDirections;
}
interface CreateUpdateDeleteWidget {
  type: 'create' | 'update' | 'delete' | 'copy';
  widget: Widget;
}
@Component({
  selector: 'app-dashboard-configuration',
  templateUrl: './dashboard-configuration.component.html',
  styleUrls: ['./dashboard-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardConfigurationComponent implements OnInit {
  @ViewChild('gridsterContainer', { static: false })
  @Output()
  dashboardActionHandler: EventEmitter<any> = new EventEmitter<any>();

  @Input() set dashboard(dashboard: Dashboard) {
    this._dashboard = dashboard ? dashboard : ({} as Dashboard);
    this.dashboardControl.setValue(this.dashboard);
    this.renderDashboard();
  }
  get dashboard(): Dashboard {
    return this._dashboard;
  }

  @Input() set dashboardDisplayMode(dashboardDisplayMode: string) {
    this._dashboardDisplayMode = dashboardDisplayMode;
  }
  get dashboardDisplayMode(): string {
    return this._dashboardDisplayMode;
  }

  gridsterContainer: ElementRef;
  dashboards$: Observable<Dashboard[]>;
  showAllDashboards = false;

  staticDropDownOptions: Dashboard[] = [
    {
      id: 'VIEW_ALL_DASHBOARDS',
      name: 'VIEW_ALL_DASHBOARDS',
      isDefault: false,
      createdBy: 'dummy'
    },
    {
      id: 'CREATE_DASHBOARD',
      name: 'CREATE_DASHBOARD',
      isDefault: false,
      createdBy: 'dummy'
    }
  ];

  widgetsDataOnLoadCreateUpdateDelete$: Observable<WidgetsData>;
  widgets: Widget[];
  widgetsDataInitial$ = new BehaviorSubject<WidgetsData>({ data: [] });
  widgetsData$: Observable<WidgetsData>;
  createUpdateDeleteWidget$ = new BehaviorSubject<CreateUpdateDeleteWidget>({
    type: 'create',
    widget: {} as Widget
  });
  selectedTabIndexControl = new FormControl(2);
  selectedTabIndex$ = this.selectedTabIndexControl.valueChanges.pipe(
    startWith(2)
  );
  options: GridInterface = {
    gridType: GridType.Fixed,
    compactType: CompactType.None,
    margin: 10,
    outerMargin: true,
    outerMarginTop: null,
    outerMarginRight: null,
    outerMarginBottom: null,
    outerMarginLeft: null,
    useTransformPositioning: true,
    mobileBreakpoint: 640,
    minCols: 12,
    maxCols: 12,
    minRows: 12,
    maxRows: 1200,
    maxItemCols: 12,
    minItemCols: 5,
    maxItemRows: 100,
    minItemRows: 6,
    maxItemArea: 2500,
    minItemArea: 1,
    defaultItemCols: 1,
    defaultItemRows: 1,
    fixedColWidth: 80,
    fixedRowHeight: 40,
    keepFixedHeightInMobile: false,
    keepFixedWidthInMobile: false,
    scrollSensitivity: 10,
    scrollSpeed: 20,
    enableEmptyCellClick: false,
    enableEmptyCellContextMenu: false,
    enableEmptyCellDrop: false,
    enableEmptyCellDrag: false,
    enableOccupiedCellDrop: false,
    emptyCellDragMaxCols: 50,
    emptyCellDragMaxRows: 50,
    ignoreMarginInRow: false,
    draggable: {
      enabled: true
    },
    resizable: {
      enabled: true
    },
    swap: false,
    pushItems: true,
    disablePushOnDrag: false,
    disablePushOnResize: false,
    pushDirections: { north: true, east: true, south: true, west: true },
    pushResizeItems: false,
    displayGrid: DisplayGrid.Always,
    disableWindowResize: false,
    disableWarnings: false,
    scrollToNewItems: false,
    itemChangeCallback: this.itemChange.bind(this),
    itemResizeCallback: this.itemResize.bind(this),
    initCallback: this.gridInit.bind(this)
  };
  widgetHeights: any = {};
  widgetWidths: any = {};
  mimimizeSidebar$: Observable<boolean>;
  interval$: Observable<number>;
  dashboardControl = new FormControl();
  readonly permissions = permissions;
  private _dashboard: Dashboard;
  private _dashboardDisplayMode: string;

  constructor(
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private widgetService: WidgetService,
    private dashboardService: DashboardService,
    private toast: ToastService
  ) {}

  @HostListener('window:resize') onResize() {
    this.dashboardService.updateGridOptions({
      update: true,
      subtractWidth: 150
    });
  }

  renderDashboard() {
    this.createUpdateDeleteWidget$.next({
      type: 'create',
      widget: {} as Widget
    });
    this.widgetsDataInitial$ = new BehaviorSubject<WidgetsData>({ data: [] });
    this.widgets = [];
    this.widgetsDataOnLoadCreateUpdateDelete$ = of({ data: [] });
    this.widgetsDataInitial$.next({ data: [] });
    this.widgetsDataOnLoadCreateUpdateDelete$ = combineLatest([
      this.widgetsDataInitial$,
      this.widgetService.getDahboardWidgetsWithReport$(this.dashboard.id),
      this.createUpdateDeleteWidget$
    ]).pipe(
      mergeMap(([initial, widgets, { type, widget }]) => {
        if (Object.keys(widget).length) {
          if (type === 'create' || type === 'copy') {
            widget.config = this.options.api.getFirstPossiblePosition(
              widget.config
            );
            const { id, config } = widget;
            return this.widgetService
              .updateWidget$({ id, config } as Widget)
              .pipe(
                map(() => {
                  initial.data = initial.data.concat([widget]);
                  return initial;
                })
              );
          } else if (type === 'update') {
            initial.data = initial.data.map((widgetDetails) => {
              if (widgetDetails.id === widget.id) {
                return widget;
              }
              return widgetDetails;
            });
            return of(initial);
          } else {
            initial.data = initial.data.filter(
              (widgetDetails) => widgetDetails.id !== widget.id
            );
            return of(initial);
          }
        } else {
          initial.data = initial.data.concat(widgets);
          return of(initial);
        }
      })
    );

    this.widgetsData$ = combineLatest([
      this.widgetsDataOnLoadCreateUpdateDelete$,
      this.selectedTabIndex$
    ]).pipe(
      map(([widgetsData, selectedReportSegment]) => {
        switch (selectedReportSegment) {
          case 0:
          case 1:
            return { data: [] };
          case 2:
            return widgetsData;
        }
      }),
      tap(({ data }) => (this.widgets = data))
    );
  }

  dashboardSelectionChanged(event: any) {
    const dashboardSelectionVal = event.value;
    this.dashboardControl.setValue(this.dashboard);
    if (dashboardSelectionVal.name === 'VIEW_ALL_DASHBOARDS') {
      this.showAllDashboards = true;
    }
    this.dashboardService.dashboardSelectionChanged(dashboardSelectionVal);
    this.dashboardService.updateGridOptions({
      update: true,
      subtractWidth: 150
    });
  }

  gridInit(gridsterComponent: GridsterComponent) {
    this.updateOptions((gridsterComponent.curWidth - 130) / 12);
  }

  itemChange(config: GridsterItem) {
    const widgetFound = this.widgets.find(
      (widget) => widget.config.id === config.id
    );
    const { id } = widgetFound;
    this.widgetService.updateWidget$({ id, config } as Widget).subscribe();
  }

  itemResize(
    config: GridsterItem,
    gridsterItemComponent: GridsterItemComponent
  ) {
    const widgetFound = this.widgets.find(
      (widget) => widget.config.id === config.id
    );
    this.widgetWidths = {
      ...this.widgetWidths,
      [widgetFound.id]: gridsterItemComponent.width
    };
    this.widgetHeights = {
      ...this.widgetHeights,
      [widgetFound.id]: gridsterItemComponent.height
    };
  }

  ngOnInit(): void {
    this.dashboards$ = this.dashboardService.dashboardsAction$;
    this.dashboardService.updateGridOptions({
      update: true,
      subtractWidth: 150
    });
    this.interval$ = this.dashboardService.updateGridOptionsAction$.pipe(
      filter(({ update }) => update),
      switchMap(({ subtractWidth }) =>
        interval(0).pipe(
          take(1),
          tap(() => {
            if (this.gridsterContainer?.nativeElement) {
              this.updateOptions(
                (this.gridsterContainer.nativeElement.offsetWidth -
                  subtractWidth) /
                  12
              );
            }
          })
        )
      )
    );
  }

  createWidget = () => {
    const dialogRef = this.dialog.open(WidgetConfigurationModalComponent, {
      data: { dashboard: this.dashboard }
    });
    dialogRef.afterClosed().subscribe((widgetDetails) => {
      if (widgetDetails && Object.keys(widgetDetails).length) {
        const { report, ...widget } = widgetDetails;
        this.spinner.show();
        this.widgetService.createWidget$(widget).subscribe((response) => {
          this.spinner.hide();
          if (Object.keys(response).length) {
            this.createUpdateDeleteWidget$.next({
              type: 'create',
              widget: { ...response, report }
            });
            this.toast.show({
              text: 'Widget Configuration saved successfully',
              type: 'success'
            });
          }
        });
      }
    });
  };

  editWidget = (widget: Widget) => {
    const dialogRef = this.dialog.open(WidgetConfigurationModalComponent, {
      data: { dashboard: this.dashboard, widget, mode: 'edit' },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((widgetDetails) => {
      if (widgetDetails && Object.keys(widgetDetails).length) {
        const { report, ...updatedWidget } = widgetDetails;
        this.spinner.show();
        const { id, config } = widget;
        this.widgetService
          .updateWidget$({ ...updatedWidget, id, config })
          .subscribe((response) => {
            this.spinner.hide();
            if (Object.keys(response).length) {
              this.createUpdateDeleteWidget$.next({
                type: 'update',
                widget: { ...response, report }
              });
              this.toast.show({
                text: 'Widget Configuration updated successfully',
                type: 'success'
              });
            }
          });
      }
    });
  };

  deleteWidget = (widget: Widget) => {
    const dialogRef = this.dialog.open(WidgetDeleteModalComponent, {
      data: { widget }
    });
    dialogRef.afterClosed().subscribe((widgetId) => {
      if (widgetId) {
        this.spinner.show();
        this.widgetService.deleteWidget$(widget).subscribe((response) => {
          this.spinner.hide();
          if (Object.keys(response).length) {
            this.createUpdateDeleteWidget$.next({
              type: 'delete',
              widget: { ...response }
            });
            this.toast.show({
              text: 'Widget deleted successfully',
              type: 'success'
            });
          }
        });
      }
    });
  };

  copyWidget = (widget: Widget) => {
    this.widgetService.copyWidget$(widget).subscribe((response) => {
      this.spinner.hide();
      if (Object.keys(response).length) {
        this.createUpdateDeleteWidget$.next({
          type: 'copy',
          widget: { ...response }
        });
        this.toast.show({
          text: 'Widget copied successfully',
          type: 'success'
        });
      }
    });
  };

  updateOptions = (fixedColWidth: number) => {
    this.options.fixedColWidth = fixedColWidth;
    this.options.api.optionsChanged();
  };

  updateDashboard(
    name: string,
    isDefault: boolean = false,
    dashboard: Dashboard
  ) {
    dashboard = { ...dashboard, name, isDefault };
    this.dashboardService
      .updateDashboard$(dashboard.id, dashboard)
      .subscribe((response) => {
        this.toast.show({
          text: 'Dashboard updated successfully',
          type: 'success'
        });
      });
  }

  editDashboard(dashboard: Dashboard) {
    this.dashboardActionHandler.emit({
      type: 'EDIT',
      data: dashboard
    });
  }

  copyDashboard(dashboard: Dashboard) {
    this.dashboardActionHandler.emit({
      type: 'COPY',
      data: dashboard
    });
  }

  deleteDashboard(dashboard: Dashboard) {
    this.dashboardActionHandler.emit({
      type: 'DELETE',
      data: dashboard
    });
  }

  markDashboardDefault(dashboard: Dashboard) {
    this.dashboardActionHandler.emit({
      type: 'MARK_DEFAULT',
      data: dashboard
    });
  }

  compareFn(option1: Dashboard, option2: Dashboard) {
    return option1.name === option2.name;
  }

  widgetActionHandler = (event: WidgetAction) => {
    const { type, value } = event;
    if (type === 'edit') {
      this.editWidget(value);
    }
  };
}
