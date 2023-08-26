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

import { COMMA, ENTER } from '@angular/cdk/keycodes';

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
import { DatePipe } from '@angular/common';
import { ErrorInfo } from 'src/app/interfaces/error-info';
import { UndoRedoUtil } from 'src/app/shared/utils/UndoRedoUtil';
import html2canvas from 'html2canvas';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { ToastService } from 'src/app/shared/toast';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import axios from 'axios';

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

@Component({
  selector: 'app-operator-rounds-dashboard',
  templateUrl: './operator-rounds-dashboard.component.html',
  styleUrls: ['./operator-rounds-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperatorRoundsDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('userInput') userInput: ElementRef;
  currentRouteUrl$: Observable<string>;
  readonly routingUrls = routingUrls;
  readonly permissions = permissions;

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

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes = [ENTER, COMMA];
  userCtrl = new FormControl();
  filteredUsers: Observable<any[]>;
  users = [];
  allUsers = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  downloadInProgress = false;

  private destroy$ = new Subject();

  constructor(
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService,
    private cdrf: ChangeDetectorRef,
    private headerService: HeaderService,
    private widgetService: WidgetService,
    private operatorRoundsService: OperatorRoundsService,
    private toastService: ToastService,

    private plantService: PlantService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private datePipe: DatePipe
  ) {
    this.filteredUsers = this.userCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this.filter(fruit) : this.allUsers.slice()
      )
    );
  }

  ngOnInit(): void {
    this.undoRedoUtil = new UndoRedoUtil();

    this.dashboardForm = this.fb.group({
      timePeriod: new FormControl('last_6_months', []),
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
            this.applyingFilters$.next(true);
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
    this.renderDashboard(this.dashboardForm.value);
  }

  filter(name: string) {
    return this.allUsers.filter(
      (user) => user.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.users.push(event.option.viewValue);
    this.userInput.nativeElement.value = '';
    this.userCtrl.setValue(null);
  }

  addUser(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.users.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.userCtrl.setValue(null);
  }

  removeUser(user: any): void {
    const index = this.users.indexOf(user);
    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }

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
    bodyFormData.append('userName', 'Fred');

    for (let i = 0; i < this.widgets.length; i++) {
      const imgData: any = await this.getWidgetImage(this.widgets[i].id);
      bodyFormData.append('image', imgData);
    }
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8007/dashboard/download-pdf',
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: bodyFormData
    };
    const { data } = await axios.request(config);
    this.downloadInProgress = false;

    const blob = new Blob([data], { type: 'application/pdf' });
    const aElement = document.createElement('a');
    aElement.setAttribute('download', `Operator Rounds Dashboard.pdf`);
    const href = URL.createObjectURL(blob);
    aElement.href = href;
    aElement.setAttribute('target', '_blank');
    aElement.click();
    URL.revokeObjectURL(href);

    /**
    const info: ErrorInfo = {
      displayToast: false,
      failureResponse: 'throwError'
    };
    this.operatorRoundsService.generateDashboardPDF$(images, info).subscribe(
      (data) => {
        console.log(data);
        // const blob = new Blob([data], { type: 'application/pdf' });
        // const aElement = document.createElement('a');
        // aElement.setAttribute('download', `Operator Rounds Dashboard.pdf`);
        // const href = URL.createObjectURL(blob);
        // aElement.href = href;
        // aElement.setAttribute('target', '_blank');
        // aElement.click();
        // URL.revokeObjectURL(href);
      },
      (err) => {
        this.toastService.show({
          text: `Error occured while generating PDF for Dashboard, ${err.message}`,
          type: 'warning'
        });
      }
    ); */
    // console.log(images);
  };

  undo = (event: Event) => {
    event.stopPropagation();
    const operation = this.undoRedoUtil.UNDO();
    const {
      currentValue,
      eventType,
      prevValue,
      prevEndDateValue,
      prevStartDateValue
    } = operation;
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
      prevValue,
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

    // this.dateRangeEvent.emit(this.dateRange);
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
  // private resetSearchInput(): void {
  //   if (this.searchInput?.nativeElement) {
  //     this.searchInput.nativeElement.value = '';
  //   }
  //   this.allPlantsData = this.plantInformation;
  // }

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
        '64e8ccd58bb29277e77bc66e',
        filters,
        info
      )
    ]).pipe(
      mergeMap(([initial, widgets]) => {
        initial.data = initial.data.concat(widgets);
        this.applyingFilters$.next(false);
        return of(initial);
      })
    );

    this.widgetsData$ = combineLatest([
      this.widgetsDataOnLoadCreateUpdateDelete$
    ]).pipe(
      // eslint-disable-next-line arrow-body-style
      map(([widgetsData]) => {
        return widgetsData;
      }),
      tap(({ data }) => (this.widgets = data))
    );
  }

  widgetActionHandler = (event: WidgetAction) => {
    console.log(event);
  };

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
