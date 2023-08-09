/* eslint-disable radix */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { Injectable, NgZone } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  from,
  Observable,
  of,
  Subject
} from 'rxjs';
import { map, share } from 'rxjs/operators';
import { ErrorInfo } from '../../interfaces/error-info';
import { WorkOrder, WorkOrders } from '../../interfaces/work-order';
import { AppService } from '../../shared/services/app.services';
import { environment } from '../../../environments/environment';

import { WorkCenter } from '../../interfaces/work-center';
import { Plant } from 'src/app/interfaces/plant';
import { SseService } from 'src/app/shared/services/sse.service';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  public workOrderBSubject: BehaviorSubject<any>;
  public allPlants$: Observable<any>;
  public workCenters$: Observable<WorkCenter[]>;
  public workOrders$: Observable<WorkOrders>;
  public plants: Plant[];
  public workCenters: WorkCenter[];
  public allPlantInfoRawObservable$: Observable<any> = null;
  private technicians$: Observable<any>;
  private destroy$ = new Subject();

  constructor(
    private zone: NgZone,
    private _appService: AppService,
    private sseService: SseService
  ) {}

  assignAllPlantRawObservable = () => {
    const rawObservable$ = this._appService
      ._getRespFromGateway(environment.mccAbapApiUrl, 'plantsInfo')
      .pipe(share());
    return rawObservable$;
  };

  closeEventSource(): void {
    this.sseService.closeEventSource();
  }
  getServerSentEvent(url: string): Observable<WorkOrders> {
    return new Observable((observer) => {
      const eventSource = this.sseService.getEventSourceWithGet(
        environment.mccAbapApiUrl,
        'updateWorkOrders',
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
    if (!this.allPlantInfoRawObservable$) {
      this.allPlantInfoRawObservable$ = this.assignAllPlantRawObservable();
    }
    this.allPlants$ = this.allPlantInfoRawObservable$.pipe(
      map((rawData) => {
        const allPlants: any = [];
        rawData.forEach((data) => {
          if (!allPlants.find((item) => item.id === data.SWERKKey)) {
            const plant = {
              id: data.SWERKKey,
              desc: data.WERKSDesc
            };
            allPlants.push(plant);
          }
        });
        return allPlants;
      }),
      share()
    );
    return this.allPlants$;
  };

  getAllWorkCenters = () => {
    if (!this.allPlantInfoRawObservable$) {
      this.allPlantInfoRawObservable$ = this.assignAllPlantRawObservable();
    }

    this.workCenters$ = this.allPlantInfoRawObservable$.pipe(
      map((rawData) => {
        const workCenters: WorkCenter[] = [];
        rawData.forEach((data) => {
          let workCenterByPlant = workCenters.find(
            (item) => item.plantId === data.SWERKKey
          );
          if (!workCenterByPlant) {
            workCenterByPlant = {
              plantId: data.SWERKKey,
              workCenters: []
            };
            workCenters.push(workCenterByPlant);
            workCenterByPlant = workCenters.find(
              (item) => item.plantId === data.SWERKKey
            );
          }
          workCenterByPlant.workCenters.push({
            plantId: data.SWERKKey,
            workCenterKey: data.ARBPLKey,
            workCenterDesc: data.ARBPLDesc
          });
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
    if (!this.allPlantInfoRawObservable$) {
      this.allPlantInfoRawObservable$ = this.assignAllPlantRawObservable();
    }
    this.technicians$ = this.allPlantInfoRawObservable$.pipe(
      map((rawData: any) => {
        let allTech = {};
        rawData.forEach((data) => {
          const newTech = this.cleanTechnicians(data);
          allTech = this.accumulateTechnicians(allTech, newTech);
        });
        return allTech;
      }),
      share()
    );

    return this.technicians$;
  }

  cleanTechnicians = (rawTechnicians: any) => {
    const technicians = {};
    if (rawTechnicians.ARBPLKey.length !== 0) {
      if (!technicians[rawTechnicians.ARBPLKey]) {
        technicians[rawTechnicians.ARBPLKey] = [];
      }
      rawTechnicians.ARBPLToPernr.results.forEach((rawTech) => {
        technicians[rawTechnicians.ARBPLKey].push({
          personName: rawTech.PERNRDesc,
          personKey: rawTech.PERNR,
          image: rawTech.FILECONTENT
        });
      });
    }
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
