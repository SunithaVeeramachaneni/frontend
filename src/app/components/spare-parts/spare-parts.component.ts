import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { SparepartsService } from './spare-parts.service';
import { data_test } from './spare-parts-data';
import { WorkOrder, WorkOrders } from '../../interfaces/scc-work-order';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import {
  map,
  startWith,
  filter,
  tap,
  mergeMap,
  switchMap,
  delay
} from 'rxjs/operators';
import { WarehouseTechnician } from '../../interfaces/warehouse_technicians';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from '../../shared/services/common.service';
import { DateSegmentService } from '../../shared/components/date-segment/date-segment.service';
import { CommonFilterService } from '../../shared/components/common-filter/common-filter.service';
@Component({
  selector: 'app-spare-parts',
  templateUrl: './spare-parts.component.html',
  styleUrls: ['./spare-parts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SparePartsComponent implements OnInit {
  subscription: Subscription;
  public workOrderList$ = new BehaviorSubject<WorkOrders>({
    '1': [],
    '2': [],
    '3': [],
    '4': [],
    '5': []
  });
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
  public workCenterList: string[] = ['Mechanical', 'Electrical'];

  public assign: string[] = [''];
  public assignList: string[] = [
    'Kerry Smith',
    'Amy Butcher',
    'Carlos Arnal',
    'Steve Austin'
  ];

  showFilters = false;
  public imageUrl;

  constructor(
    private sparepartsSvc: SparepartsService,
    private sanitizer: DomSanitizer,
    private commonFilterService: CommonFilterService,
    private dateSegmentService: DateSegmentService
  ) {}

  ngOnInit() {
    this.isDataLoading = false;
    this.commonFilterService.clearFilter();
    this.filterObj$ = this.commonFilterService.commonFilterAction$;
    this.dateRange$ = new BehaviorSubject(
      this.dateSegmentService.getStartAndEndDate('month')
    );
    this.getWorkOrders();
    this.getTechnicians();
  }

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
    const tempFilteredWorkOrderList$ = combineLatest([
      tempWorkOrderList$,
      this.filterObj$
    ]).pipe(
      map(([workOrders, filterObj]) => {
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
    const event = details.fName;
    const workorderid = details.workOrderID;
    let technician = this.technicians$.pipe(
      map((epics) => epics.filter((epic) => epic.fName === event))
    );
    technician.subscribe((technician) => {
      console.log('Technician ', technician);
      let data = {
        USNAM: technician[0].userId,
        ASSIGNEE: technician[0].fName,
        AUFNR: workorderid
      };
      this.filteredWorkOrderList$.next(null);
      this.sparepartsSvc
        .assignTechnicianToWorkorder(data)
        .pipe(delay(5000))
        .subscribe((res) => {
          if (res) {
            this.getWorkOrders();
          }
        });
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

  public filterPriority = (status, priority) => {
    if (priority === null || priority.length == 0) {
      return true;
    } else {
      for (let i = 0; i < priority.length; i++) {
        if (priority[i] + ' Priority' === status) return true;
      }
      return false;
    }
  };
}
