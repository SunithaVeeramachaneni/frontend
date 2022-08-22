import { Injectable, NgZone } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  from,
  Observable,
  of,
  Subject
} from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  reduce,
  share,
  takeUntil,
  tap
} from 'rxjs/operators';
import { ErrorInfo } from '../../interfaces/error-info';
import { WorkOrder, WorkOrders } from '../../interfaces/work-order';
import { AppService } from '../../shared/services/app.services';
import { environment } from '../../../environments/environment';

import { WarehouseTechnician } from '../../interfaces/warehouse_technicians';
import { WorkCenter } from '../../interfaces/work-center';
import { Plant } from 'src/app/interfaces/plant';
import { SseService } from 'src/app/shared/services/sse.service';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private destroy$ = new Subject();
  constructor(
    private zone: NgZone,
    private _appService: AppService,
    private sseService: SseService
  ) {}

  private technicians$: Observable<any>;
  public workOrderBSubject: BehaviorSubject<any>;
  public allPlants$: Observable<any>;
  public workCenters$: Observable<WorkCenter[]>;
  public workOrders$: Observable<WorkOrders>;
  public plants: Plant[];
  public workCenters: WorkCenter[];

  closeEventSource(): void {
    this.sseService.closeEventSource();
  }
  getServerSentEvent(url: string): Observable<WorkOrders> {
    return new Observable((observer) => {
      const eventSource = this.sseService.getEventSourceWithGet(
        this._appService.prepareUrl(
          environment.mccAbapApiUrl,
          'updateWorkOrders'
        ),
        null
      );
      eventSource.stream();
      eventSource.onmessage = (event) => {
        const workOrders: WorkOrders = {
          unassigned: [],
          assigned: [],
          inProgress: [],
          completed: []
        };
        let workOrder: WorkOrder;
        let technicians;
        const workOrderList = JSON.parse(event.data);
        this.technicians$.subscribe((resp) => (technicians = resp));
        workOrderList.forEach((workOrder) => {
          const assignedTechnician = this.getAssignedTechnician(
            technicians,
            workOrder
          );
          workOrder.technician = assignedTechnician;
          if (workOrder.status)
            workOrders[`${workOrder.status}`].push(
              this.workOrderToCard(workOrder)
            );
        });

        if (workOrderList.length !== 0) {
          this.zone.run(() => {
            observer.next(workOrders);
          });
        }
      };

      eventSource.onerror = (event) => {
        this.zone.run(() => {
          if (event.data) {
            observer.error(JSON.parse(event.data));
          }
        });
      };
    });
  }

  getAllPlants = () => {
    const rawObservable$ = this._appService._getRespFromGateway(
      environment.mccAbapApiUrl,
      'plants'
    );

    this.allPlants$ = rawObservable$.pipe(
      map((rawPlantsData) => {
        const allPlants: any = [];
        Object.keys(rawPlantsData).map((key) => {
          const plant: Plant = {
            id: key,
            desc: rawPlantsData[key]
          };

          allPlants.push(plant);
        });
        return allPlants;
      }),
      share()
    );
    return this.allPlants$;
  };

  getAllWorkCenters = () => {
    const rawObservable$ = this._appService._getRespFromGateway(
      environment.mccAbapApiUrl,
      `workCenters`
    );
    this.workCenters$ = rawObservable$.pipe(
      map((rawWorkCenters) => {
        const workCenters: WorkCenter[] = [];
        Object.keys(rawWorkCenters).map((key) => {
          workCenters.push(rawWorkCenters[key]);
        });
        return workCenters;
      }),
      share()
    );
    return this.workCenters$;
  };

  getAllWorkOrders(
    pagination: boolean = true,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<WorkOrders> {
    const workOrders$ = this._appService._getRespFromGateway(
      environment.mccAbapApiUrl,
      'workOrdersAndOperations/WorkOrderOperationSet'
    );
    this.workOrders$ = combineLatest([workOrders$, this.technicians$]).pipe(
      map(([workOrderList, technicians]) => {
        const workOrders: WorkOrders = {
          unassigned: [],
          assigned: [],
          inProgress: [],
          completed: []
        };
        let workOrder: WorkOrder;
        let assignedTechnician = [{}];
        let i = 0;
        workOrderList.forEach((workOrder) => {
          i = i + 1;
          assignedTechnician = this.getAssignedTechnician(
            technicians,
            workOrder
          );
          workOrder.technician = assignedTechnician;
          if (workOrder.status)
            workOrders[`${workOrder.status}`].push(
              this.workOrderToCard(workOrder)
            );
        });
        return workOrders;
      })
    );
    return this.workOrders$;
  }

  getTechnicians(info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    this.technicians$ = this.allPlants$.pipe(
      mergeMap((allPlants) =>
        from(allPlants).pipe(
          mergeMap((plant: Plant) =>
            this._appService
              ._getRespFromGateway(
                environment.mccAbapApiUrl,
                `technicians/'${plant.id}'`
              )
              .pipe(
                map((technicians) => this.cleanTechnicians(technicians)),
                takeUntil(this.destroy$),
                catchError((err) => err.message)
              )
          )
        )
      ),
      reduce((acc: any, cur) => this.accumulateTechnicians(acc, cur)),
      share()
    );
    return this.technicians$;
  }

  cleanTechnicians = (rawTechnicians): any => {
    const technicians = {};
    rawTechnicians.forEach((rawTech) => {
      if (rawTech.ARBPL.length !== 0) {
        if (!technicians[rawTech.ARBPL]) {
          technicians[rawTech.ARBPL] = [];
        }
        technicians[rawTech.ARBPL].push({
          personName: rawTech.ENAME,
          personKey: rawTech.PERNR,
          image: rawTech.FILECONTENT
        });
      }
    });
    return technicians;
  };

  accumulateTechnicians = (acc, cur) => {
    const accumulator = acc;
    Object.keys(cur).forEach((key) => {
      if (accumulator[key]) {
        accumulator[key] = [...accumulator[key], ...cur[key]];
      } else {
        accumulator[key] = cur[key];
      }
    });
    return accumulator;
  };

  setAssigneeAndWorkCenter = (params) => {
    const req = {
      workOrderID: params.workOrderID,
      details: {
        ARBPL: params.workCenter.workCenterKey,
        ENAME: params.assignee.personName,
        PARNR: params.assignee.personKey,
        PRIOK: params.priorityNumber,
        PRIOKX: params.priorityStatus
      }
    };
    return this._appService._putDataToGateway(
      environment.mccAbapApiUrl,
      'workOrdersAndOperations',
      req
    );
  };

  getAssignedTechnician = (technicians, workOrder) => {
    let assignedTechnician = [{}];
    if (technicians[`${workOrder.workCenter}`]) {
      assignedTechnician = technicians[workOrder.workCenter].filter(
        (technician) => {
          const condition =
            parseInt(technician.personKey) ===
            parseInt(workOrder.personDetails);
          return condition;
        }
      );
    }
    return assignedTechnician;
  };

  getWorkOrderByID = (id) => {
    const rawWorkOrder$ = this._appService._getRespFromGateway(
      environment.mccAbapApiUrl,
      `workOrder/${id}`
    );
    const workOrder$ = combineLatest([rawWorkOrder$, this.technicians$]).pipe(
      map(([workOrder, technicians]) => {
        const workOrders: WorkOrders = {
          unassigned: [],
          assigned: [],
          inProgress: [],
          completed: []
        };
        const assignedTechnician = this.getAssignedTechnician(
          technicians,
          workOrder
        );
        workOrder.technician = assignedTechnician;
        workOrders[`${workOrder.status}`].push(this.workOrderToCard(workOrder));
        return workOrders;
      })
    );

    return workOrder$;
  };

  workOrderToCard = (workOrder: WorkOrder) => {
    const card = {
      status: workOrder.status,
      priorityText: workOrder.priorityStatus,
      priorityNumber: workOrder.priorityNumber,
      kitStatusText: workOrder.kitStatus,
      workOrderID: workOrder.workOrderID,
      headerText: workOrder.workOrderID + ' - ' + workOrder.workOrderDesc,
      workCenterInfo: workOrder.workCenter + ' -  ' + workOrder.equipmentName,
      dueDate: workOrder.dueDate,
      operations: workOrder.operations,
      workCenter: workOrder.workCenter,
      plant: workOrder.plant,
      technician: workOrder.technician,
      estimatedTime: null,
      actualTime: null,
      timeProgress: null,
      operationProgress: null,
      isLoading: false
    };
    if (card.status === 'unassigned' || card.status === 'assigned') {
      card.estimatedTime = workOrder.estimatedTime;
    } else if (card.status === 'inProgress' || card.status === 'completed') {
      card.estimatedTime = workOrder.estimatedTime;
      card.actualTime = workOrder.actualTime;
      card.timeProgress = workOrder.timeProgress;
      card.operationProgress = workOrder.operationProgress;
    }

    return card;
  };

  destroy() {
    this.destroy$.next();
    this.destroy$.complete();
    setTimeout(() => {
      this.destroy$ = new Subject();
    }, 500);
  }
}
