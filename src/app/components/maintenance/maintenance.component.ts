/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-underscore-dangle */
/* eslint-disable guard-for-in */
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ViewChild,
  DoCheck
} from '@angular/core';
import { MaintenanceService } from './maintenance.service';
import { WorkOrder, WorkOrders } from '../../interfaces/work-order';
import { Plant } from '../../interfaces/plant';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subscription,
  throwError
} from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { map, startWith, retryWhen, tap, catchError } from 'rxjs/operators';
import { ModalComponent } from './modal/modal.component';
import { WorkCenter } from '../../interfaces/work-center';
import { DomSanitizer } from '@angular/platform-browser';
import { DateSegmentService } from '../../shared/components/date-segment/date-segment.service';
import { CommonFilterService } from '../../shared/components/common-filter/common-filter.service';
import { MatDialog } from '@angular/material/dialog';
import { isEqual } from 'lodash-es';
import { format } from 'date-fns';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaintenanceComponent implements OnInit, OnDestroy, DoCheck {
  @ViewChild('allSelectedPlants') public allSelectedPlants: MatOption;
  @ViewChild('allSelectedWorkCenters')
  public allSelectedWorkCenters: MatOption;

  public workOrderList$: Observable<WorkOrders>;
  public updateWorkOrderList$: Observable<WorkOrders>;
  public combinedWorkOrderList$: Observable<WorkOrders>;
  public combinedWorkOrderList1$: Observable<WorkOrders>;
  public emptyWorkOrder: WorkOrders = {
    unassigned: [],
    assigned: [],
    inProgress: [],
    completed: []
  };
  public filteredWorkOrderList$: Observable<WorkOrders> = of({
    unassigned: [],
    assigned: [],
    inProgress: [],
    completed: []
  });
  public allWorkOrders: WorkOrders;
  public filter: FormControl;
  public filter$: Observable<string>;
  public selectDate$: Observable<string>;
  public putWorkOrder$: BehaviorSubject<WorkOrders> = new BehaviorSubject({
    unassigned: [],
    assigned: [],
    inProgress: [],
    completed: []
  });
  public plantFilter: FormControl = new FormControl([]);
  public workCenterFilter: FormControl = new FormControl([]);
  public overdueFilter: FormControl;
  public overdueFilter$: Observable<string>;
  public plantFilter$: Observable<Plant[]>;
  public workCenterFilter$: Observable<WorkCenter[]>;
  public currentWorkCenters$: Observable<WorkCenter[]>;
  public filterObj$: Observable<any>;
  public allPlants$: Observable<Plant[]>;
  public allWorkCenters$: Observable<WorkCenter[]>;

  public workOrders: Observable<WorkOrder[]>;
  public workCenterList: WorkCenter[];
  public workCenterList$: Observable<WorkCenter[]>;
  public technicians: any = {};
  public technicians$: Observable<any> = new Observable();
  public dateRange$: BehaviorSubject<any>;
  public techniciansDisplayList$;
  public selectedUser;
  headerTitle = 'Maintenance Control Center';
  dateSegmentPosition: string;

  public showOverdue = '';
  public showOverdueList: string[] = ['Yes', 'No'];

  public priority: string[] = ['Very High'];
  public priorityList: string[] = ['Very High', 'High', 'Medium', 'Low'];

  public kitStatus: string[] = [];
  public kitStatusList: string[] = [
    'Kit Ready',
    'Parts Available',
    'Waiting On Parts'
  ];

  public assign: string[] = [];
  hideList = true;
  showFilters = false;

  public showOperationsList = {};
  public base64Code: any;
  private allPlants: Plant[];
  private currentWorkCenters: WorkCenter[];
  private technicianSubscription: Subscription;

  constructor(
    private maintenanceSvc: MaintenanceService,
    private sanitizer: DomSanitizer,
    private _commonFilterService: CommonFilterService,
    private _dateSegmentService: DateSegmentService,
    public dialog: MatDialog
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
    this._commonFilterService.clearFilter();
    this.dateRange$ = new BehaviorSubject(
      this._dateSegmentService.getStartAndEndDate('month')
    );
    this.allWorkCenters$ = this.maintenanceSvc.getAllWorkCenters().pipe(
      tap((resp) => {
        this.workCenterList = resp;
      })
    );
    this.allPlants$ = this.maintenanceSvc.getAllPlants().pipe(
      tap((plants) => {
        this.allPlants = plants;
        this.plantFilter.patchValue([...plants, 0]);
      })
    );
    this.technicianSubscription = this.maintenanceSvc
      .getTechnicians()
      .subscribe((resp) => {
        this.technicians = resp;
      });
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
    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    this.overdueFilter = new FormControl('');
    this.overdueFilter$ = this.overdueFilter.valueChanges.pipe(startWith(''));
    this.filterObj$ = this._commonFilterService.commonFilterAction$;
    this.getWorkOrders();
  }

  ngOnDestroy() {
    this.technicianSubscription.unsubscribe();
    this.maintenanceSvc.destroy();
    this.maintenanceSvc.closeEventSource();
  }

  ngDoCheck(): void {
    const rect = document.getElementById('dateSegment').getBoundingClientRect();
    this.dateSegmentPosition = `${rect.right - 75}px`;
  }

  getImageSrc = (source: string) => {
    if (source) {
      const base64Image = 'data:image/jpeg;base64,' + source;
      return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
    }
  };

  compareFn(option1: any, option2: any) {
    return isEqual(option1, option2);
  }

  dateRangeEventHandler($event: any) {
    this.dateRange$.next($event);
  }

  getWorkOrders() {
    this.workOrderList$ = this.maintenanceSvc.getAllWorkOrders();

    this.updateWorkOrderList$ = this.maintenanceSvc
      .getServerSentEvent('/updateWorkOrders')
      .pipe(
        startWith({
          unassigned: [],
          assigned: [],
          inProgress: [],
          completed: []
        }),
        retryWhen((error) =>
          error.pipe(
            tap((err) => {
              if (err && err.status === 401) {
                this.maintenanceSvc.closeEventSource();
              } else {
                throw err;
              }
            }),
            catchError((err) => throwError(err))
          )
        )
      );
    this.combinedWorkOrderList1$ = this.combineWorkOrders(
      this.workOrderList$,
      this.updateWorkOrderList$.pipe(
        catchError(() =>
          of({
            unassigned: [],
            assigned: [],
            inProgress: [],
            completed: []
          })
        )
      )
    );
    this.combinedWorkOrderList$ = this.combineWorkOrders(
      this.combinedWorkOrderList1$,
      this.putWorkOrder$
    );
    this.filteredWorkOrderList$ = combineLatest([
      this.combinedWorkOrderList$,
      this.dateRange$,
      this.filterObj$,
      this.plantFilter$,
      this.workCenterFilter$
    ]).pipe(
      map(
        ([
          workOrders,
          filterDate,
          filterObj,
          plantFilter,
          workCenterFilter
        ]) => {
          const filtered: WorkOrders = {
            unassigned: [],
            assigned: [],
            inProgress: [],
            completed: []
          };
          let a;
          for (const key in workOrders) {
            filtered[key] = workOrders[key].filter(
              (workOrder) =>
                workOrder.headerText
                  .toLowerCase()
                  .indexOf(
                    filterObj.search ? filterObj.search.toLowerCase() : ''
                  ) !== -1 &&
                this.filterDate(workOrder.dueDate, filterDate) &&
                this.isOverdue(workOrder.dueDate, filterObj.showOverdue) &&
                this.filterPriority(
                  workOrder.priorityText,
                  filterObj.priority
                ) &&
                this.filterPlant(workOrder.plant, plantFilter) &&
                this.filterWorkCenter(
                  workOrder.plant,
                  workOrder.workCenter,
                  workCenterFilter
                ) &&
                this.filterAssignee(
                  workOrder.technician[0],
                  filterObj.assign
                ) &&
                this.filterKitStatus(
                  workOrder.kitStatusText,
                  filterObj.kitStatus
                )
            );
          }
          return filtered;
        }
      )
    );
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
            oldWorkOrders[key] = [...newWorkOrders[key], ...oldWorkOrders[key]];
          }
        }
        return oldWorkOrders;
      })
    );

  public filterPriority = (status, priority) => {
    if (priority === null || priority.length === 0) {
      return true;
    } else {
      for (let i = 0; i < priority.length; i++) {
        if (priority[i] === status) return true;
      }
      return false;
    }
  };

  public filterKitStatus = (workOrderKitStatus, kitStatus) => {
    if (kitStatus === null || kitStatus.length === 0) {
      return true;
    } else {
      for (let i = 0; i < kitStatus.length; i++) {
        if (kitStatus[i] === workOrderKitStatus) return true;
      }
      return false;
    }
  };

  filterPlant = (plant, filter) => {
    if (filter.length === 0) return false;
    else {
      return filter.some((item) => item.id === plant);
    }
  };

  filterWorkCenter = (plant, workCenter, filter) => {
    if (filter.length === 0) {
      return false;
    } else {
      return filter.some(
        (item) => item.workCenterKey === workCenter && item.plantId === plant
      );
    }
  };

  filterAssignee = (technician, assignee) => {
    if (assignee === null || assignee.length === 0) {
      return true;
    } else {
      for (let i = 0; i < assignee.length; i++) {
        if (technician && assignee[i].personName === technician.personName) {
          return true;
        }
      }
      return false;
    }
  };

  public filterDate(dueDate, filterDate) {
    const date = `${format(new Date(dueDate), 'yyyy-MM-dd')}T00:00:00`;
    return date >= filterDate.startDate && date <= filterDate.endDate;
  }

  public isOverdue = (dueDate, overdue) => {
    if (overdue !== 'No') return true;
    else if (overdue === 'No') {
      const interval = 1000 * 60 * 60 * 24; // 24 hours in milliseconds
      const startOfDay = Math.floor(Date.now() / interval) * interval;
      const endOfDay = startOfDay + interval - 1; // 23:59:59:9999
      const dueDateTime = new Date(dueDate).getTime();
      if (dueDateTime < startOfDay) {
      }
      return dueDate >= startOfDay;
    }
  };

  public myFunction() {
    this.showFilters = !this.showFilters;
  }

  public optionsFn(event, index) {
    if (event.target.value) {
      this.selectedUser = event.target.value;
    }
  }

  public showOperations(woID) {
    this.showOperationsList[`${woID}`] = !this.showOperationsList[`${woID}`];
  }

  async onAssignPress(workOrder: any) {
    // first we delete the old work order
    // next, a ghost loaded work order (isLoading = true) is added to the assigned section
    // once assign is pressed, the observable is updated so that isLoading
    // if assign is suceess, change isLoading to false
    // if assign is fail, move work order back to unassigned

    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        techniciansList: this.technicians,
        workCenterList: this.workCenterList,
        defaultWorkCenter: workOrder.workCenter,
        workOrderID: workOrder.workOrderID,
        priorityNumber: workOrder.priorityNumber,
        priorityText: workOrder.priorityText,
        plant: workOrder.plant
      }
    });

    dialogRef.afterClosed().subscribe(async (data) => {
      if (data) {
        const resp = data;
        const workOrderID = resp.workOrderID;
        this.putWorkOrder$.next({
          ...this.emptyWorkOrder,
          assigned: [{ ...workOrder, isLoading: true, status: 'assigned' }]
        });

        const res = this.maintenanceSvc.setAssigneeAndWorkCenter(resp);
        res.subscribe(async (response) => {
          if (response === true) {
            const workOrder$ =
              this.maintenanceSvc.getWorkOrderByID(workOrderID);
            workOrder$.subscribe((workOrderNew) =>
              this.putWorkOrder$.next(workOrderNew)
            );
          } else {
            this.putWorkOrder$.next({
              ...this.emptyWorkOrder,
              [`${workOrder.status}`]: [{ ...workOrder, isLoading: false }]
            });
          }
        });
      }
    });
  }
}
