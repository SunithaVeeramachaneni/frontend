/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable guard-for-in */
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  DoCheck
} from '@angular/core';
import { MatOption } from '@angular/material/core';
import { SparepartsService } from './spare-parts.service';
import { WorkOrder, WorkOrders } from '../../interfaces/scc-work-order';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith, filter, tap, mergeMap } from 'rxjs/operators';
import { WarehouseTechnician } from '../../interfaces/warehouse_technicians';
import { DomSanitizer } from '@angular/platform-browser';
import { DateSegmentService } from '../../shared/components/date-segment/date-segment.service';
import { CommonFilterService } from '../../shared/components/common-filter/common-filter.service';
import { MaintenanceService } from '../maintenance/maintenance.service';
import { Plant } from 'src/app/interfaces/plant';
import { WorkCenter } from 'src/app/interfaces/work-center';
import { isEqual } from 'lodash-es';

@Component({
  selector: 'app-spare-parts',
  templateUrl: './spare-parts.component.html',
  styleUrls: ['./spare-parts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SparePartsComponent implements OnInit, OnDestroy, DoCheck {
  @ViewChild('allSelectedPlants') public allSelectedPlants: MatOption;
  @ViewChild('allSelectedWorkCenters')
  public allSelectedWorkCenters: MatOption;
  public plantFilter: FormControl = new FormControl([]);
  public workCenterFilter: FormControl = new FormControl([]);
  public plantFilter$: Observable<Plant[]>;
  public workCenterFilter$: Observable<WorkCenter[]>;
  subscription: Subscription;
  public emptyWorkOrders: WorkOrders = {
    '1': [],
    '2': [],
    '3': [],
    '4': [],
    '5': []
  };
  public putWorkOrder$: BehaviorSubject<WorkOrders> = new BehaviorSubject(
    this.emptyWorkOrders
  );

  public allPlants$: Observable<Plant[]>;
  public allWorkCenters$: Observable<WorkCenter[]>;
  public currentWorkCenters$: Observable<WorkCenter[]>;
  public workOrderList$ = new BehaviorSubject<WorkOrders>(this.emptyWorkOrders);
  public filteredWorkOrderList$ = new BehaviorSubject<WorkOrders>(null);
  public combineWorkOrderList$: Observable<WorkOrders>;
  public updatedWorkOrderList$: Observable<WorkOrders>;
  public filter: FormControl;
  public filter$: Observable<string>;
  public dateRange$: BehaviorSubject<any>;

  public workOrders: Observable<WorkOrder[]>;
  public technicians$: Observable<WarehouseTechnician[]>;
  public filterObj$: Observable<any>;

  public baseCode: any;
  public technicians: WarehouseTechnician[];

  public selectedUser = '';
  headerTitle = 'Spare Parts Control Center';
  dateSegmentPosition: string;
  hideList = true;

  public isDataLoading;

  public showOverdue = '';
  public showOverdueList: string[] = ['Yes', 'No'];

  public priority: string[] = [''];
  public priorityList: string[] = ['Very High', 'High', 'Medium', 'Low'];

  public kitStatus: string[] = [''];
  public kitStatusList: string[] = [
    'Kit Ready',
    'Parts Available',
    'Waiting On Parts'
  ];

  public workCenter: string[] = [''];

  public assign: string[] = [''];
  public assignList: string[] = [
    'Kerry Smith',
    'Amy Butcher',
    'Carlos Arnal',
    'Steve Austin'
  ];

  showFilters = false;
  public imageUrl;

  private allPlants: Plant[];
  private currentWorkCenters: WorkCenter[];

  constructor(
    private sparepartsSvc: SparepartsService,
    private sanitizer: DomSanitizer,
    private commonFilterService: CommonFilterService,
    private dateSegmentService: DateSegmentService,
    private maintenanceSvc: MaintenanceService
  ) {}

  togglePerPlant(input: string) {
    if (input === 'plants') {
      if (this.allSelectedPlants.selected) {
        this.allSelectedPlants.deselect();
      }
      if (this.plantFilter.value.length === this.allPlants.length) {
        this.allSelectedPlants.select();
      }
    } else {
      if (this.allSelectedWorkCenters.selected) {
        this.allSelectedWorkCenters.deselect();
      }
      let workCenterFilterLength = 0;
      this.currentWorkCenters.forEach((wC) => {
        workCenterFilterLength += wC.workCenters.length;
      });
      if (this.workCenterFilter.value.length === workCenterFilterLength) {
        this.allSelectedWorkCenters.select();
      }
    }
  }

  toggleAllSelection(input: string) {
    if (input === 'plants') {
      if (this.allSelectedPlants.selected) {
        this.plantFilter.patchValue([...this.allPlants, 0]);
      } else {
        this.plantFilter.patchValue([this.allPlants[0]]);
      }
      let currentWorkCenters = [];
      this.currentWorkCenters.forEach((wC) => {
        currentWorkCenters = [...currentWorkCenters, ...wC.workCenters];
      });
      this.workCenterFilter.patchValue([...currentWorkCenters, 0]);
    } else {
      if (this.allSelectedWorkCenters.selected) {
        let currentWorkCenters = [];
        this.currentWorkCenters.forEach((wC) => {
          currentWorkCenters = [...currentWorkCenters, ...wC.workCenters];
        });
        this.workCenterFilter.patchValue([...currentWorkCenters, 0]);
      } else {
        this.workCenterFilter.patchValue([
          this.currentWorkCenters[0].workCenters[0]
        ]);
      }
    }
  }

  ngOnInit() {
    this.plantFilter$ = this.plantFilter.valueChanges.pipe(startWith([]));
    this.workCenterFilter$ = this.workCenterFilter.valueChanges.pipe(
      startWith([])
    );
    this.isDataLoading = false;
    this.commonFilterService.clearFilter();
    this.filterObj$ = this.commonFilterService.commonFilterAction$;
    this.allPlants$ = this.maintenanceSvc.getAllPlants().pipe(
      tap((plants) => {
        this.allPlants = plants;
        this.plantFilter.patchValue([...plants, 0]);
      })
    );
    this.allWorkCenters$ = this.maintenanceSvc.getAllWorkCenters();
    this.currentWorkCenters$ = combineLatest([
      this.plantFilter$,
      this.allWorkCenters$
    ]).pipe(
      map(([plantFilters, allWorkCenters]) => {
        let currentWorkCenters: WorkCenter[] = [];
        let currentWorkCenterFilter: any = [];
        plantFilters.forEach((plant) => {
          const wC = allWorkCenters.find(
            (item: WorkCenter) => item.plantId === plant.id
          );
          if (wC) {
            currentWorkCenters = [...currentWorkCenters, wC];
            currentWorkCenterFilter = [
              ...currentWorkCenterFilter,
              ...wC.workCenters
            ];
          }
        });
        this.currentWorkCenters = currentWorkCenters;
        this.workCenterFilter.patchValue([...currentWorkCenterFilter, 0]);
        return currentWorkCenters;
      })
    );
    this.currentWorkCenters$.subscribe();
    this.dateRange$ = new BehaviorSubject(
      this.dateSegmentService.getStartAndEndDate('month')
    );
    this.getWorkOrders();
    this.getTechnicians();
  }

  ngOnDestroy() {
    this.sparepartsSvc.stopSeamlessUpdate();
  }

  ngDoCheck(): void {
    const rect = document.getElementById('dateSegment').getBoundingClientRect();
    this.dateSegmentPosition = `${rect.right - 75}px`;
  }

  compareFn(option1: any, option2: any) {
    return isEqual(option1, option2);
  }

  combineWorkOrders = (
    oldWorkOrders$: Observable<WorkOrders>,
    newWorkOrders$: Observable<WorkOrders>
  ): Observable<WorkOrders> =>
    combineLatest([oldWorkOrders$, newWorkOrders$]).pipe(
      map(([oldWorkOrders, newWorkOrders]) => {
        if (newWorkOrders) {
          for (const key in newWorkOrders) {
            if (newWorkOrders[key])
              newWorkOrders[key].forEach((workOrder: { workOrderID: any }) => {
                const id = workOrder.workOrderID;
                for (const key2 in oldWorkOrders) {
                  oldWorkOrders[key2] = oldWorkOrders[key2].filter(
                    (oldWorkOrder: { workOrderID: any }) =>
                      !(oldWorkOrder.workOrderID === id)
                  );
                }
              });
            if (oldWorkOrders[key]) {
              oldWorkOrders[key] = [
                ...newWorkOrders[key],
                ...oldWorkOrders[key]
              ];
            } else {
              oldWorkOrders[key] = [...newWorkOrders[key]];
            }
          }
        }
        return oldWorkOrders;
      })
    );

  getTechnicians() {
    this.technicians$ = this.sparepartsSvc.getPickerList();
    this.technicians$.subscribe((resp) => (this.technicians = resp));
  }

  public myFunction() {
    this.showFilters = !this.showFilters;
  }

  dateRangeEventHandler($event: any) {
    this.filteredWorkOrderList$.next(null);
    this.dateRange$.next($event);
  }

  getWorkOrders() {
    const tempWorkOrderList$ = this.dateRange$
      .asObservable()
      .pipe(mergeMap((val) => this.sparepartsSvc.getAllWorkOrders(val)));
    const updatedWorkOrderList$ = this.combineWorkOrders(
      tempWorkOrderList$,
      this.putWorkOrder$
    );
    const tempFilteredWorkOrderList$ = combineLatest([
      updatedWorkOrderList$,
      this.filterObj$,
      this.plantFilter$,
      this.workCenterFilter$
    ]).pipe(
      map(([workOrders, filterObj, plantFilters, workCenterFilters]) => {
        const filtered: WorkOrders = {
          '1': [],
          '2': [],
          '3': [],
          '4': [],
          '5': []
        };
        for (const key in workOrders)
          filtered[key] = workOrders[key].filter(
            (workOrder) =>
              workOrder.workOrderID
                .toLowerCase()
                .indexOf(
                  filterObj.search ? filterObj.search.toLowerCase() : ''
                ) !== -1 &&
              this.isOverdue(workOrder.dueDate, filterObj.showOverdue) &&
              this.filterPlant(workOrder.plant, plantFilters) &&
              this.filterWorkCenter(
                workOrder.plant,
                workOrder.workCenter,
                workCenterFilters
              ) &&
              this.filterPriority(workOrder.priorityStatus, filterObj.priority)
          );
        this.isDataLoading = false;
        return filtered;
      })
    );
    tempFilteredWorkOrderList$.subscribe((resp) => {
      this.filteredWorkOrderList$.next(resp);
    });
  }

  assignTech(details) {
    const { technician, workOrder } = details;
    const addWorkOrder = {
      ...this.emptyWorkOrders,
      2: [{ ...workOrder, isLoading: true, statusCode: '2' }]
    };
    this.putWorkOrder$.next(addWorkOrder);
    const data = {
      USNAM: technician.userId,
      ASSIGNEE: technician.fName,
      AUFNR: workOrder.workOrderID
    };
    this.sparepartsSvc.assignTechnicianToWorkorder(data).subscribe((res) => {
      if (res) {
        const newWorkOrder$ = this.sparepartsSvc.getWorkOrderByID(
          workOrder.workOrderID
        );
        newWorkOrder$.subscribe((workOrderNew) => {
          this.putWorkOrder$.next(workOrderNew);
        });
      } else {
        this.putWorkOrder$.next({
          ...this.emptyWorkOrders,
          [`${workOrder.statusCode}`]: [{ ...workOrder, isLoading: false }]
        });
      }
    });
  }

  public isOverdue = (dueDate, overdue) => {
    if (overdue !== 'No') return true;
    else if (overdue === 'No') {
      const interval = 1000 * 60 * 60 * 24; // 24 hours in milliseconds
      const startOfDay = Math.floor(Date.now() / interval) * interval;
      const endOfDay = startOfDay + interval - 1; // 23:59:59:9999
      return dueDate >= startOfDay;
    }
  };

  filterPlant = (plant, filters) => {
    if (filter.length === 0) return false;
    else {
      return filters.some((item) => item.id === plant);
    }
  };

  filterWorkCenter = (plant, workCenter, filters) => {
    if (filters.length === 0) {
      return true;
    } else {
      return filters.some(
        (item) => item.workCenterKey === workCenter && item.plantId === plant
      );
    }
  };

  public filterPriority = (status, priority) => {
    if (priority === null || priority.length === 0) {
      return true;
    } else {
      for (let i = 0; i < priority.length; i++) {
        if (priority[i] + ' Priority' === status) return true;
      }
      return false;
    }
  };
}
