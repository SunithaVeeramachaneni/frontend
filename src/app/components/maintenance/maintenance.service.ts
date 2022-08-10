import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';
import { map, mergeMap, reduce, share, tap } from 'rxjs/operators';
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
        this.setPlants(allPlants);
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
        this.setWorkCenters(workCenters);
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
    this.technicians$ = this.workCenters$.pipe(
      mergeMap((workCenters) =>
        from(workCenters).pipe(
          mergeMap((workCenter) =>
            from(workCenter.workCenters).pipe(
              mergeMap((wC) =>
                this._appService
                  ._getRespFromGateway(
                    environment.mccAbapApiUrl,
                    `technicians/'${wC.id}'`
                  )
                  .pipe(
                    tap((data) => {}),
                    map((technicians) => ({
                      [wC.id]: this.cleanTechnicians(technicians)
                    }))
                  )
              )
            )
          )
        )
      ),
      reduce((acc: any, cur) => (acc = { ...acc, ...cur }), {}),
      share()
    );
    return this.technicians$;
  }

  cleanTechnicians = (rawTechnicians): WarehouseTechnician[] => {
    const technicians = rawTechnicians.map((rawTechnician) => ({
      personName: rawTechnician.PERNRDesc,
      personKey: rawTechnician.PERNRKey,
      image: rawTechnician.FILECONTENT
    }));
    return technicians;
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

  setPlants = (plants: any) => {
    this.plants = plants;
  };

  getPlants = () => this.plants;

  setWorkCenters = (workCenters: any) => {
    this.workCenters = workCenters;
  };

  getWorkCenters = () => this.workCenters;
}
