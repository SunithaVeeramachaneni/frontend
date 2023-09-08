/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import { permissions, routingUrls } from 'src/app/app.constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
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
import { Widget, WidgetAction, WidgetsData } from 'src/app/interfaces/widget';
import { WidgetService } from '../../dashboard/services/widget.service';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  mergeMap,
  pairwise,
  startWith,
  takeUntil,
  tap
} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { format, isEqual } from 'date-fns';
import { DatePipe, formatDate } from '@angular/common';
import { ErrorInfo } from 'src/app/interfaces/error-info';
import { UndoRedoUtil } from 'src/app/shared/utils/UndoRedoUtil';
import html2canvas from 'html2canvas';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { LoginService } from '../../login/services/login.service';
import { WidgetDeleteModalComponent } from '../../dashboard/widget-delete-modal/widget-delete-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { WidgetConfigurationModalComponent } from '../../dashboard/widget-configuration-modal/widget-configuration-modal.component';
import { Dashboard } from 'src/app/interfaces';
import { ToastService } from 'src/app/shared/toast';
import { DateUtilService } from 'src/app/shared/utils/dateUtils';
import { EmailDialogComponent } from '../email-dialog/email-dialog.component';

declare global {
  interface FormData {
    entries(): Iterator<[string, string | Blob]>;
  }
}

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
  selector: 'app-operator-rounds-dashboard',
  templateUrl: './operator-rounds-dashboard.component.html',
  styleUrls: ['./operator-rounds-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperatorRoundsDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('emailMenuTrigger') emailMenuTrigger: MatMenuTrigger;
  currentRouteUrl$: Observable<string>;
  readonly routingUrls = routingUrls;
  readonly permissions = permissions;

  options: GridInterface = {
    gridType: GridType.Fixed,
    compactType: CompactType.CompactUpAndLeft,
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
  dashboardId = '';
  dashboard: Dashboard;

  widgets: Widget[];
  widgetsData$: Observable<WidgetsData>;
  widgetsDataOnLoadCreateUpdateDelete$: Observable<WidgetsData>;
  widgetsDataInitial$ = new BehaviorSubject<WidgetsData>({ data: [] });
  applyingFilters$ = new BehaviorSubject<boolean>(false);

  allPlantsData;
  plantInformation;
  searchInput: ElementRef<HTMLInputElement> = null;
  dashboardForm: FormGroup;
  selectedPlantShifts = [];

  public selectDate: string;
  startDate: any;
  endDate: any;
  dateRange: any;
  customText = 'Custom';
  undoRedoUtil: any;

  downloadInProgress = false;

  createUpdateDeleteWidget$ = new BehaviorSubject<CreateUpdateDeleteWidget>({
    type: 'create',
    widget: {} as Widget
  });

  private destroy$ = new Subject();

  constructor(
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService,
    private cdrf: ChangeDetectorRef,
    private headerService: HeaderService,
    private widgetService: WidgetService,
    private operatorRoundService: OperatorRoundsService,
    private loginService: LoginService,
    private plantService: PlantService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private toast: ToastService,
    private readonly dateUtilService: DateUtilService
  ) {}

  ngOnInit(): void {
    this.undoRedoUtil = new UndoRedoUtil();

    this.dashboardForm = this.fb.group({
      timePeriod: new FormControl('last_month', []),
      plantId: new FormControl('', []),
      shiftId: new FormControl('', []),
      startDate: new FormControl(''),
      endDate: new FormControl('')
    });
    this.dashboardForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(100),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([previous, current]) => {
          if (!isEqual(previous, current)) {
            this.renderDashboard(current);
          }
        })
      )
      .subscribe();
    this.plantService.fetchAllPlants$().subscribe((plants) => {
      this.allPlantsData = plants.items || [];
      this.plantInformation = this.allPlantsData;
      this.cdrf.detectChanges();
    });

    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    this.widgetService
      .getDashboardByModule$('operator_rounds', { isActive: true }, info)
      .subscribe((resp: any) => {
        resp.isDefault = true;
        this.dashboard = resp;
        this.dashboardId = resp.id;
        this.renderDashboard(this.dashboardForm.value);
      });

    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap((currentRouteUrl) => {
        if (currentRouteUrl === routingUrls.operatorRoundPlans.url) {
          this.headerService.setHeaderTitle(
            routingUrls.operatorRoundPlans.title
          );
          this.breadcrumbService.set(routingUrls.operatorRoundPlans.url, {
            skip: true
          });
          this.cdrf.detectChanges();
        } else {
          this.breadcrumbService.set(routingUrls.operatorRoundPlans.url, {
            skip: false
          });
        }
      })
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

  // cancelEmail = () => {
  //   // this.emailMenuTrigger.closeMenu();
  //   // this.emailNotes = '';
  //   // this.toEmailIDs = '';
  // };

  getWidgetImage = async (widgetId) => {
    const elem = document.getElementById(widgetId.toString());
    return new Promise(async (resolve, reject) => {
      try {
        const canvas = await html2canvas(elem);
        const data = canvas.toDataURL();
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  };

  downloadDashboardAsImage = async () => {
    this.downloadInProgress = true;
    const bodyFormData = new FormData();
    const { timePeriod, plantId, shiftId, startDate, endDate } =
      this.dashboardForm.value;
    bodyFormData.append('plantId', plantId);
    bodyFormData.append('shiftId', shiftId);
    bodyFormData.append('timePeriod', timePeriod);

    const userName = this.loginService.getLoggedInUserName();
    bodyFormData.append('userName', userName);
    let startDateTemp = startDate;
    let endDateTemp = endDate;
    const DATE_FORMAT = 'dd MMM yyyy';
    if (timePeriod === 'custom') {
      startDateTemp = formatDate(new Date(startDate), DATE_FORMAT, 'en-us');
      endDateTemp = formatDate(new Date(endDate), DATE_FORMAT, 'en-us');
      bodyFormData.append('startDate', startDate);
      bodyFormData.append('endDate', endDate);
    }

    for (let i = 0; i < this.widgets.length; i++) {
      const imgData: any = await this.getWidgetImage(this.widgets[i].id);
      bodyFormData.append('image', imgData);
    }
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    const customHeaders = {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    this.operatorRoundService
      .generateDashboardPDF$(bodyFormData, customHeaders, info)
      .pipe(
        tap((resp: any) => {
          const url = window.URL.createObjectURL(resp);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'RoundsDashboard.pdf');
          document.body.appendChild(link);
          link.click();
          this.downloadInProgress = false;
          this.cdrf.detectChanges();
        })
      )
      .subscribe();
  };

  undo = (event: Event) => {
    event.stopPropagation();
    const operation = this.undoRedoUtil.UNDO();
    const { eventType, prevValue, prevEndDateValue, prevStartDateValue } =
      operation;
    if (eventType === 'TIME_PERIOD') {
      this.dashboardForm.patchValue({ timePeriod: prevValue });
    } else if (eventType === 'CUSTOM_TIME_PERIOD') {
      this.dashboardForm.patchValue({
        startDate: prevStartDateValue,
        endDate: prevEndDateValue
      });
    } else if (eventType === 'PLANT') {
      this.dashboardForm.patchValue({ plantId: prevValue });
    } else if (eventType === 'SHIFT') {
      this.dashboardForm.patchValue({ shiftId: prevValue });
    }
  };

  redo = (event: Event) => {
    event.stopPropagation();
    const operation = this.undoRedoUtil.REDO();

    const {
      currentValue,
      eventType,
      currentStartDateValue,
      currentEndDateValue
    } = operation;
    if (eventType === 'TIME_PERIOD') {
      this.dashboardForm.patchValue({ timePeriod: currentValue });
    } else if (eventType === 'CUSTOM_TIME_PERIOD') {
      this.dashboardForm.patchValue({
        startDate: currentStartDateValue,
        endDate: currentEndDateValue
      });
    } else if (eventType === 'PLANT') {
      this.dashboardForm.patchValue({ plantId: currentValue });
    } else if (eventType === 'SHIFT') {
      this.dashboardForm.patchValue({ shiftId: currentValue });
    }
  };
  dateChanged(event) {
    if (event.value !== 'custom') {
      this.selectDate = event.value;
      this.startDate = '';
      this.endDate = '';
      this.customText = 'Custom';
      this.undoRedoUtil.WRITE({
        eventType: 'TIME_PERIOD',
        prevValue: this.dashboardForm.value.timePeriod,
        currentValue: event.value
      });
      this.dashboardForm.patchValue({
        timePeriod: event.value,
        startDate: '',
        endDate: ''
      });
    }
  }

  appliedDateRange(start, end) {
    if (start && end) {
      this.dateRange = {
        startDate: `${format(start, 'yyyy-MM-dd')}T00:00:00`,
        endDate: end
          ? `${format(end, 'yyyy-MM-dd')}T23:59:59`
          : `${format(start, 'yyyy-MM-dd')}T23:59:59`
      };
      this.customText = `${this.datePipe.transform(
        `${start}`,
        'dd MMM YYYY',
        '',
        this.translateService.currentLang
      )}`;
      if (end)
        this.customText += `- ${this.datePipe.transform(
          `${end}`,
          'dd MMM YYYY',
          '',
          this.translateService.currentLang
        )}`;
      this.undoRedoUtil.WRITE({
        eventType: 'CUSTOM_TIME_PERIOD',
        prevStartDateValue: this.dashboardForm.value.startDate,
        prevEndDateValue: this.dashboardForm.value.endDate,
        currentStartDateValue: this.dateRange.startDate,
        currentEndDateValue: this.dateRange.endDate
      });
      this.dashboardForm.patchValue({
        timePeriod: 'custom',
        startDate: this.dateRange.startDate,
        endDate: this.dateRange.endDate
      });
    }
  }
  onSelectPlant(plant) {
    const selectedPlant = this.allPlantsData.find((p) => p.plantId === plant);
    if (selectedPlant) {
      this.undoRedoUtil.WRITE({
        eventType: 'PLANT',
        prevValue: this.dashboardForm.value.plantId,
        currentValue: selectedPlant.plantId
      });
      const { shifts = '[]' } = selectedPlant;
      const shiftsJSON = JSON.parse(shifts);
      this.selectedPlantShifts = [...shiftsJSON];
      this.cdrf.detectChanges();
    }
  }
  onSelectShift(shift) {
    this.undoRedoUtil.WRITE({
      eventType: 'SHIFT',
      prevValue: this.dashboardForm.value.shiftId,
      currentValue: shift
    });
  }
  onKeyPlant(event) {
    const value = event.target.value || '';
    if (!value) {
      this.allPlantsData = this.plantInformation;
    } else {
      this.allPlantsData = this.searchPlant(value);
    }
  }
  searchPlant(value: string) {
    const searchValue = value.toLowerCase();
    return this.plantInformation.filter(
      (plant) =>
        (plant.name && plant.name.toLowerCase().indexOf(searchValue) !== -1) ||
        (plant.plantId &&
          plant.plantId.toLowerCase().indexOf(searchValue) !== -1)
    );
  }

  openEmailDialog = () => {
    const dialogRef = this.dialog.open(EmailDialogComponent, {
      disableClose: true,
      data: {}
    });
    dialogRef.afterClosed().subscribe((resp) => {
      if (Object.keys(resp).length && resp.toEmailIDs) {
        this.sendEmail(resp.toEmailIDs, resp.emailNotes);
      }
    });
  };

  sendEmail = async (toEmailIDs, emailNotes) => {
    const bodyFormData = new FormData();
    const { timePeriod, plantId, shiftId, startDate, endDate } =
      this.dashboardForm.value;
    bodyFormData.append('plantId', plantId);
    bodyFormData.append('shiftId', shiftId);
    bodyFormData.append('toEmailIDs', toEmailIDs);
    bodyFormData.append('notes', emailNotes);

    const userName = this.loginService.getLoggedInUserName();
    bodyFormData.append('userName', userName);
    let startDateTemp = startDate;
    let endDateTemp = endDate;
    const DATE_FORMAT = 'dd MMM yyyy';
    if (timePeriod !== 'custom') {
      const startEndDate = this.dateUtilService.getStartAndEndDates(
        timePeriod,
        startDateTemp,
        endDateTemp
      );
      startDateTemp = formatDate(
        new Date(startEndDate.startDate),
        DATE_FORMAT,
        'en-us'
      );
      endDateTemp = formatDate(
        new Date(startEndDate.endDate),
        DATE_FORMAT,
        'en-us'
      );
      bodyFormData.append('timePeriod', `${startDateTemp} - ${endDateTemp}`);
    } else {
      startDateTemp = formatDate(new Date(startDate), DATE_FORMAT, 'en-us');
      endDateTemp = formatDate(new Date(endDate), DATE_FORMAT, 'en-us');
      bodyFormData.append('timePeriod', `${startDate} - ${endDate}`);
    }

    for (let i = 0; i < this.widgets.length; i++) {
      const imgData: any = await this.getWidgetImage(this.widgets[i].id);
      bodyFormData.append('image', imgData);
    }
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    const customHeaders = {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    this.operatorRoundService
      .sendDashboardAsEmail$(bodyFormData, customHeaders, info)
      .pipe(tap((resp: any) => {}))
      .subscribe(
        (res) => {
          // this.emailMenuTrigger.closeMenu();
          // this.emailNotes = '';
          // this.toEmailIDs = '';
        },
        (err) => {
          // this.emailMenuTrigger.closeMenu();
          // this.emailNotes = '';
          // this.toEmailIDs = '';
        }
      );
  };

  updateOptions = (fixedColWidth: number) => {
    this.options.fixedColWidth = fixedColWidth;
    this.options.api.optionsChanged();
  };
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

  renderDashboard(filters) {
    this.createUpdateDeleteWidget$.next({
      type: 'create',
      widget: {} as Widget
    });
    this.applyingFilters$.next(true);
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    this.widgets = [];
    this.widgetsDataInitial$ = new BehaviorSubject<WidgetsData>({ data: [] });
    this.widgetsDataOnLoadCreateUpdateDelete$ = of({ data: [] });
    this.widgetsDataInitial$.next({ data: [] });

    this.widgetsDataOnLoadCreateUpdateDelete$ = combineLatest([
      this.widgetsDataInitial$,
      this.widgetService.getDahboardWidgetsWithReport$(
        this.dashboardId,
        filters,
        info
      ),
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
      this.widgetsDataOnLoadCreateUpdateDelete$
    ]).pipe(
      // eslint-disable-next-line arrow-body-style
      map(([widgetsData]) => {
        this.applyingFilters$.next(false);
        return widgetsData;
      }),
      tap(({ data }) => (this.widgets = data))
    );
  }

  widgetActionHandler = (event: WidgetAction) => {
    const { type, value } = event;
    if (type === 'edit') {
      this.editWidget(value);
    }
  };

  // getStartAndEndDates = (timePeriod) => {
  //   const today = new Date();
  //   let startDate;
  //   let endDate;
  //   switch (timePeriod) {
  //     case 'last_6_months':
  //       // eslint-disable-next-line no-case-declarations
  //       const todayClone1 = new Date(today.getTime());
  //       startDate = todayClone1.setMonth(todayClone1.getMonth() - 6);
  //       endDate = today;
  //       break;
  //     case 'last_3_months':
  //       // eslint-disable-next-line no-case-declarations
  //       const todayClone2 = new Date(today.getTime());
  //       startDate = todayClone2.setMonth(todayClone2.getMonth() - 3);
  //       endDate = today;
  //       break;
  //     case 'this_week':
  //       startDate = new Date(today.setDate(today.getDate() - today.getDay()));
  //       endDate = new Date(today.setDate(today.getDate() - today.getDay() + 6));
  //       break;
  //     case 'this_month':
  //       startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  //       endDate = today;
  //       break;
  //     default:
  //       break;
  //   }
  //   return { startDate, endDate };
  // };

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
