/* eslint-disable guard-for-in */
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ViewChild
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
import {
  FormBuilder,
  FormControl,
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { map, startWith, mergeMap, retryWhen, take, tap } from 'rxjs/operators';
import { ModalComponent } from './modal/modal.component';
import { WorkCenter } from '../../interfaces/work-center';
import { DomSanitizer } from '@angular/platform-browser';
import { DateSegmentService } from '../../shared/components/date-segment/date-segment.service';
import * as moment from 'moment';
import { CommonFilterService } from '../../shared/components/common-filter/common-filter.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaintenanceComponent implements OnInit, OnDestroy {
  @ViewChild('allSelected') private allSelected: MatOption;
  filterGroup = this.fb.group({
    plants: new FormControl([], [this.matSelectValidator()]),
    workCenters: new FormControl([])
  });
  get plants() {
    return this.filterGroup.get('plants');
  }
  get workCenters() {
    return this.filterGroup.get('workCenters');
  }

  public currentWorkCenters: any = [];
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
  public overdueFilter: FormControl;
  public overdueFilter$: Observable<string>;
  public filterObj$: Observable<any>;
  public workOrders: Observable<WorkOrder[]>;
  public workCenterList: WorkCenter[];
  public workCenterList$: Observable<WorkCenter[]>;
  public technicians: any = {};
  public technicians$: Observable<any> = new Observable();
  public dateRange$: BehaviorSubject<any>;
  public techniciansDisplayList$;
  public selectedUser;
  headerTitle = 'Maintenance Control Center';

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

  public workCenter: string[] = [];
  public plantsList = [];
  public workCentersList = [];

  public assign: string[] = [];

  public showOperationsList = {};
  public base64Code: any;
  private allPlants$: Observable<Plant[]>;
  private allWorkCenters$: Observable<any>;
  private workCenterSubscription: Subscription;
  private technicianSubscription: Subscription;
  hideList = true;
  showFilters = false;
  constructor(
    private fb: FormBuilder,
    private maintenanceSvc: MaintenanceService,
    private sanitizer: DomSanitizer,
    private _commonFilterService: CommonFilterService,
    private _dateSegmentService: DateSegmentService,
    public dialog: MatDialog
  ) {}

  matSelectValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      !control.value.length ? { selectOne: { value: control.value } } : null;
  }

  togglePerPlant(notSelected: boolean, id: any) {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
    }
    if (
      this.filterGroup.controls.plants.value.length === this.plantsList.length
    ) {
      this.allSelected.select();
    }
    this.workCenterFilter(notSelected, id);
  }

  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.filterGroup.controls.plants.patchValue([...this.plantsList, 0]);
      this.currentWorkCenters = this.workCentersList;
    } else {
      this.filterGroup.controls.plants.patchValue([this.plantsList[0]]);
      this.currentWorkCenters = [
        this.workCentersList.find(
          (item) => item.plantId === this.plantsList[0].id
        )
      ];
    }
  }

  ngOnInit() {
    this._commonFilterService.clearFilter();
    this.dateRange$ = new BehaviorSubject(
      this._dateSegmentService.getStartAndEndDate('month')
    );
    this.plantsList = this.maintenanceSvc.getPlants();
    if (!this.plantsList.length) {
      this.allPlants$ = this.maintenanceSvc.getAllPlants().pipe(
        tap((resp) => {
          this.plantsList = resp;
          this.filterGroup.controls.plants.patchValue([...this.plantsList, 0]);
        })
      );
    }
    this.workCenterList = this.maintenanceSvc.getWorkCenters();
    if (!this.workCenterList.length) {
      this.allWorkCenters$ = this.maintenanceSvc.getAllWorkCenters().pipe(
        tap((resp) => {
          this.workCentersList = resp;
          this.currentWorkCenters = this.workCentersList;
        })
      );
    }
    this.technicianSubscription = this.maintenanceSvc
      .getTechnicians()
      .subscribe((resp) => {
        this.technicians = resp;
      });
    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    this.overdueFilter = new FormControl('');
    this.overdueFilter$ = this.overdueFilter.valueChanges.pipe(startWith(''));
    this.filterObj$ = this._commonFilterService.commonFilterAction$;
    this.getWorkOrders();
  }

  ngOnDestroy() {
    this.technicianSubscription.unsubscribe();
    this.workCenterSubscription.unsubscribe();
    this.maintenanceSvc.closeEventSource();
  }

  getImageSrc = (source: string) => {
    if (source) {
      const base64Image = 'data:image/jpeg;base64,' + source;
      return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
    }
  };

  workCenterFilter = (notSelected: boolean, id: any) => {
    if (notSelected) {
      const workCenterByPlant = this.workCentersList.find(
        (item: any) => item.plantId === id
      );
      this.currentWorkCenters = [...this.currentWorkCenters, workCenterByPlant];
      this.currentWorkCenters.sort(
        (a, b) => parseInt(a.plantId, 10) - parseInt(b.plantId, 10)
      );
    } else {
      this.currentWorkCenters = this.currentWorkCenters.filter(
        (item: any) => item.plantId !== id
      );
    }
  };

  filterWorkOrders = (notSelected: boolean, id: any) => {
    console.log(notSelected);
    console.log(id);
    console.log(this.filterGroup.get('workCenters').value);
  };

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
            mergeMap((err) => {
              if (err && err.status === 401) {
                this.maintenanceSvc.closeEventSource();
                return of(err);
              }
              return throwError(err);
            }),
            take(1)
          )
        )
      );
    this.combinedWorkOrderList1$ = this.combineWorkOrders(
      this.workOrderList$,
      this.updateWorkOrderList$
    );
    this.combinedWorkOrderList$ = this.combineWorkOrders(
      this.combinedWorkOrderList1$,
      this.putWorkOrder$
    );
    this.filteredWorkOrderList$ = combineLatest([
      this.combinedWorkOrderList$,
      this.dateRange$,
      this.filterObj$
    ]).pipe(
      map(([workOrders, filterDate, filterObj]) => {
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
              this.filterPriority(workOrder.priorityText, filterObj.priority) &&
              this.filterWorkCenter(
                workOrder.workCenter,
                filterObj.workCenter
              ) &&
              this.filterAssignee(workOrder.technician[0], filterObj.assign) &&
              this.filterKitStatus(workOrder.kitStatusText, filterObj.kitStatus)
          );
        }
        console.log(filtered);
        return filtered;
      })
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
    if (kitStatus === null || kitStatus.length == 0) {
      return true;
    } else {
      for (let i = 0; i < kitStatus.length; i++) {
        if (kitStatus[i] === workOrderKitStatus) return true;
      }
      return false;
    }
  };

  filterWorkCenter = (workCenter, filter) => {
    if (filter === null || filter.length == 0) {
      return true;
    } else {
      for (let i = 0; i < filter.length; i++) {
        if (filter[i].workCenterKey == workCenter) {
          return true;
        }
      }
      return false;
    }
  };

  filterAssignee = (technician, assignee) => {
    if (assignee === null || assignee.length == 0) {
      return true;
    } else {
      for (let i = 0; i < assignee.length; i++) {
        if (technician && assignee[i].personName == technician.personName) {
          return true;
        }
      }
      return false;
    }
  };

  public filterDate(dueDate, filterDate) {
    const sDate = moment(dueDate);
    sDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const date = sDate.format('YYYY-MM-DDTHH:mm:ss');
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
        priorityText: workOrder.priorityText
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
