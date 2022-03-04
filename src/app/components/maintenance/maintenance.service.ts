import { Injectable, NgZone } from "@angular/core"
import { BehaviorSubject, combineLatest, from, Observable, of, Subject } from "rxjs";
import { map, mergeAll, mergeMap, reduce, scan, share, switchMap, tap } from "rxjs/operators";
import { ErrorInfo } from "../../interfaces/error-info";
import { WorkOrder, WorkOrders } from "../../interfaces/work-order";
import { AppService } from "../../shared/services/app.services"
import { environment } from '../../../environments/environment';
import { WarehouseTechnician, WarehouseTechnicians } from "../../interfaces/warehouse_technicians";
import { WorkCenter } from "../../interfaces/work-center";

@Injectable({ providedIn: "root" })
export class MaintenanceService {
  constructor(private _zone: NgZone, private _appService: AppService) { }

  private transformedObservable$;
  private technicians$: Observable<any>;
  private eventSource: EventSource;
  public workOrderBSubject: BehaviorSubject<any>;
  public workCenters$: Observable<WorkCenter[]>
  public workOrders$: Observable<WorkOrders>

  private selectOptions: string[] = ['PRIOK', 'PRIOKX', 'COLOUR', 'AUFNR', 'AUFTEXT', 'ARBPL', 'KTEXT', 'PARNR', 'IPHAS', 'WorkOrderOperationSet/STATUS', 'WorkOrderOperationSet/ARBEI', 'IPHAS', 'GSTRP']

  closeEventSource(): void {
      this.eventSource.close()
  }
  getServerSentEvent(url: string): Observable<WorkOrders> {
    return new Observable(observer => {
      this.eventSource = new EventSource(this._appService.prepareUrl(environment.mccAbapApiUrl, 'updateWorkOrders'))
      this.eventSource.onmessage = event => {
        let workOrders: WorkOrders = { unassigned: [], assigned: [], inProgress: [], completed: [] };
        let workOrder: WorkOrder;
        let technicians
        let workOrderList = JSON.parse(event.data);
        this.technicians$.subscribe(resp => technicians = resp);
        workOrderList.forEach(workOrder => {
          const assignedTechnician = this.getAssignedTechnician(technicians, workOrder)
          workOrder.technician = assignedTechnician
          if(workOrder.status)
          workOrders[`${workOrder.status}`].push(this.workOrderToCard(workOrder))
        });

        if (workOrderList !== []) {
          this._zone.run(() => {
            observer.next(workOrders);
          });

        }
      }
    });
  }

  getAllWorkCenters = () => {
    let rawObservable$ = this._appService._getRespFromGateway(environment.mccAbapApiUrl, `workCenters/${1000}`);
    this.workCenters$ = rawObservable$.pipe(map(rawWorkCenters => {
      let workCenters: WorkCenter[] = [];

      rawWorkCenters.forEach(rawWorkCenter => {
        let workCenter: WorkCenter = { workCenterDesc: "", workCenterKey: "" };
        workCenter.workCenterDesc = rawWorkCenter.ARBPLDesc
        workCenter.workCenterKey = rawWorkCenter.ARBPLKey
        workCenters.push(workCenter)
      });
      return workCenters
    }),
      share()
    )
    return this.workCenters$;
  }

  getAllWorkOrders(pagination: boolean = true, info: ErrorInfo = {} as ErrorInfo): Observable<WorkOrders> {
    let workOrders$ = this._appService._getRespFromGateway(environment.mccAbapApiUrl, 'workOrdersAndOperations/WorkOrderOperationSet');
    this.workOrders$ = combineLatest([workOrders$, this.technicians$]).pipe(map(([workOrderList, technicians]) => {
      let workOrders: WorkOrders = { unassigned: [], assigned: [], inProgress: [], completed: [] };
      let workOrder: WorkOrder;
      let assignedTechnician = [{}];
      let i =0
      workOrderList.forEach(workOrder => {
        i = i+1;
        assignedTechnician = this.getAssignedTechnician(technicians, workOrder)
        workOrder.technician = assignedTechnician;
        if(workOrder.status)
        workOrders[`${workOrder.status}`].push(this.workOrderToCard(workOrder))
      });
      return workOrders;
    }))
    return this.workOrders$
  }

  getTechnicians(info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    this.technicians$ = this.workCenters$.pipe(mergeMap(workCenters =>
      from(workCenters).pipe(
        mergeMap(workCenter =>
          this._appService._getRespFromGateway(environment.mccAbapApiUrl, `technicians/'${workCenter.workCenterKey}'`).pipe(tap(data => {
          }),
            map(technicians => {
              return ({
                [workCenter.workCenterKey]: this.cleanTechnicians(technicians)
              })
            }

            ))),
      ),),
      reduce((acc: any, cur) => {
        return acc = { ...acc, ...cur }
      }, {}),
      share()
    )
    return this.technicians$
  }

  cleanTechnicians = (rawTechnicians): WarehouseTechnician[] => {
    let technicians = rawTechnicians.map(rawTechnician => {
      return ({
        personName: rawTechnician.PERNRDesc,
        personKey: rawTechnician.PERNRKey,
        image: rawTechnician.FILECONTENT
      })
    })
    return technicians;
  }
  setAssigneeAndWorkCenter = async (params) => {
    let req = {
      workOrderID: params.workOrderID,
      details: {
        ARBPL: params.workCenter.workCenterKey,
        ENAME: params.assignee.personName,
        PARNR: params.assignee.personKey,
        PRIOK: params.priorityNumber,
        PRIOKX: params.priorityStatus
      }
    }
    let res = await this._appService._putDataToGateway(environment.mccAbapApiUrl, 'workOrdersAndOperations', req);
    return res;
  }

  getAssignedTechnician = (technicians, workOrder) =>{
    let assignedTechnician = [{}];
    if (technicians[`${workOrder.workCenter}`]) {
      assignedTechnician = technicians[workOrder.workCenter].filter(technician => {
        let condition = parseInt(technician.personKey) === parseInt(workOrder.personDetails)
        return condition
      })
    }
    return assignedTechnician;
  }


  getWorkOrderByID = async (id) => {
    let rawWorkOrder$ = await this._appService._getRespFromGateway(environment.mccAbapApiUrl, `workOrder/${id}`)
    let workOrder$ = combineLatest([rawWorkOrder$, this.technicians$]).pipe(map(([workOrder, technicians]) => {
      let workOrders: WorkOrders = { unassigned: [], assigned: [], inProgress: [], completed: [] };
      let assignedTechnician = this.getAssignedTechnician(technicians, workOrder)
      workOrder.technician = assignedTechnician
      workOrders[`${workOrder.status}`].push(this.workOrderToCard(workOrder))
      return workOrders;
    }))

    return workOrder$
  }

  workOrderToCard = (workOrder: WorkOrder) => {
    let card = {
    status: workOrder.status,
    priorityText: workOrder.priorityStatus,
    priorityNumber: workOrder.priorityNumber,
    kitStatusText: workOrder.kitStatus,
    workOrderID: workOrder.workOrderID,
    headerText: workOrder.workOrderID + ' - ' + workOrder.workOrderDesc,
    workCenterInfo: workOrder.workCenter + ' -  ' + workOrder.equipmentName,  
    dueDate: workOrder.dueDate,
    operations: workOrder.operations,
    workCenter : workOrder.workCenter,
    technician: workOrder.technician
    }

    if(card.status === 'unassigned' || card.status === 'assigned'){
      card['estimatedTime'] = workOrder.estimatedTime;
    }
    else
      if(card.status === 'inProgress' || card.status === 'completed'){
        card['estimatedTime'] = workOrder.estimatedTime;
        card['actualTime'] = workOrder.actualTime;
        card['timeProgress'] = workOrder.timeProgress;
        card['operationProgress'] = workOrder.operationProgress
      }


      return card


}
}
