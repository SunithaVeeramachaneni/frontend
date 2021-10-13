import { Injectable, NgZone } from "@angular/core"
import { BehaviorSubject, combineLatest, from, Observable, of, Subject } from "rxjs";
import { map, mergeAll, mergeMap, reduce, scan, switchMap, tap } from "rxjs/operators";
import { ErrorInfo } from "../../interfaces/error-info";
import { WorkOrder, WorkOrders } from "../../interfaces/work-order";
import { AppService } from "../../shared/services/app.services"
import { environment } from '../../../environments/environment';
import { Technician, Technicians } from "../../interfaces/technicians";
import { WorkCenter } from "../../interfaces/work-center";

@Injectable({ providedIn: "root" })
export class MaintenanceService {
  constructor(private _zone: NgZone, private _appService: AppService) { }

  private transformedObservable$;
  private technicians$: Observable<any>;
  public workOrderBSubject: BehaviorSubject<any>;
  public workCenters$: Observable<WorkCenter[]>
  public workOrders$: Observable<WorkOrders>

  private selectOptions: string[] = ['PRIOK', 'PRIOKX', 'COLOUR', 'AUFNR', 'AUFTEXT', 'ARBPL', 'KTEXT', 'PARNR', 'IPHAS', 'WorkOrderOperationSet/STATUS', 'WorkOrderOperationSet/ARBEI', 'IPHAS', 'GSTRP']

  private statusMap = {
    "CRTD": "assigned",
    "REL": "inProgress",
    "TECO": "completed"
  }

  getServerSentEvent(url: string): Observable<WorkOrders> {
    return new Observable(observer => {
      const eventSource = new EventSource(this._appService.prepareUrl(environment.mccAbapApiUrl, 'updateWorkOrders'))
      eventSource.onmessage = event => {
        let workOrders: WorkOrders = { unassigned: [], assigned: [], inProgress: [], completed: [] };
        let workOrder: WorkOrder;
        let technicians
        let rawWorkOrders = JSON.parse(event.data);
        this.technicians$.subscribe(resp => technicians = resp);
        rawWorkOrders.forEach(rawWorkOrder => {
          workOrder = this.cleanWorkOrder(rawWorkOrder, "")
          workOrders[`${workOrder.status}`].push(workOrder)
        });

        if (rawWorkOrders !== []) {
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
    }))
    return this.workCenters$;
  }

  getAllWorkOrders(pagination: boolean = true, info: ErrorInfo = {} as ErrorInfo): Observable<WorkOrders> {
    let workOrders$ = this._appService._getRespFromGateway(environment.mccAbapApiUrl, 'workOrdersAndOperations/WorkOrderOperationSet', info);
    this.workOrders$ = combineLatest([workOrders$, this.technicians$]).pipe(map(([rawWorkOrders, technicians]) => {
      let workOrders: WorkOrders = { unassigned: [], assigned: [], inProgress: [], completed: [] };
      let workOrder: WorkOrder;
      let assignedTechnician = null;
      rawWorkOrders.forEach(rawWorkOrder => {
        assignedTechnician = this.getAssignedTechnician(technicians, rawWorkOrder)
        // console.log(rawWorkOrder.AUFNR, " The raw work order before cleaning is", rawWorkOrder)
        workOrder = this.cleanWorkOrder(rawWorkOrder, assignedTechnician)
        // console.log(workOrder.workOrderID, " The work order after cleaning is", workOrder)
        workOrders[`${workOrder.status}`].push(workOrder)
      });
      return workOrders;
    }))
    this.workOrders$.subscribe(this.workOrderBSubject)
    return this.workOrders$
  }

  parseJsonDate(jsonDateString) {
    return new Date(parseInt(jsonDateString.replace('/Date(', '')));
  }

  formatTime = (inputHours) => { //move to utils directory
    inputHours = parseFloat(inputHours);
    const minutes = Math.floor(inputHours % 1 * 60);
    const hours = Math.floor(inputHours);
    if (minutes !== 0)
      if (hours === 1)
        return `${hours} hr ${minutes} min`
      else
        return `${hours} hrs ${minutes} min`
    else
      if (hours === 1)
        return `${hours} hr`
      else
        return `${hours} hrs`
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
      )),
      reduce((acc: any, cur) => {
        return acc = { ...acc, ...cur }
      }, {})
    )
    return this.technicians$
  }

  cleanTechnicians = (rawTechnicians): Technician[] => {
    let technicians = rawTechnicians.map(rawTechnician => {
      return ({
        personName: rawTechnician.PERNRDesc,
        personKey: rawTechnician.PERNRKey,
        image: rawTechnician.FILECONTENT
      })
    })
    return technicians;
  }

  getEstimatedTime = (operations) => {
    let time = 0
    operations.forEach(operation => {
      time += parseFloat(operation.ARBEI)
    });
    return time;
  }

  getActualTime = (operations) => {
    let time = 0
    operations.forEach(operation => {
      time += parseFloat(operation.ISMNW)
    });
    return time;
  }

  getOperationProgress = (operations) => {
    let totalNoOfOperations = 0;
    let noOfCompletedOperations = 0;
    operations.forEach(operation => {
      totalNoOfOperations += 1;
      if (operation.STATUS === 'CNF')
        noOfCompletedOperations += 1;
    });
    let completedOperationsProgressBar = (1 / totalNoOfOperations) * noOfCompletedOperations;
    return [noOfCompletedOperations, totalNoOfOperations, completedOperationsProgressBar];
  }

  getTimeProgress = (estimatedTime, actualTime) => {
    // console.log("estimated time", estimatedTime, "actual time",actualTime);
    let timeProgress = actualTime / estimatedTime
    return timeProgress;
  }

  getStatus(personDetails, rawStatus) {
    let status = rawStatus.split(',')[0]
    if (!personDetails) return 'unassigned'
    else return this.statusMap[`${status}`]
  }

  cleanOperation = (operations) => {
    let cleaned = operations.map(operation => {
      return ({
        "actualTime": this.formatTime(operation.ISMNW),
        "estimatedTime": this.formatTime(operation.ARBEI),
        "timeProgress": operation.ISMNW / operation.ARBEI,
        "operationName": operation.LTXA1
      })
    })
    // console.log("Operation Details", cleaned)
    return cleaned

  }

  cleanWorkOrder(rawWorkOrder, assignedTechnician) {
    return ({
      status: this.getStatus(rawWorkOrder['PARNR'], rawWorkOrder['IPHAS']),
      personDetails: rawWorkOrder['PARNR'],
      priorityNumber: rawWorkOrder['PRIOK'],
      priorityStatus: rawWorkOrder['PRIOKX'],
      colour: rawWorkOrder['COLOUR'],
      workOrderID: rawWorkOrder['AUFNR'],
      workOrderDesc: rawWorkOrder['AUFTEXT'],
      workCenter: rawWorkOrder['ARBPL'],
      equipmentName: rawWorkOrder['KTEXT'],
      kitStatus: rawWorkOrder['TXT04'],
      dueDate: this.parseJsonDate(rawWorkOrder['GLTRP']),
      estimatedTime: this.formatTime(this.getEstimatedTime(rawWorkOrder.WorkOrderOperationSet.results)),
      actualTime: this.formatTime(this.getActualTime(rawWorkOrder.WorkOrderOperationSet.results)),
      operationProgress: this.getOperationProgress(rawWorkOrder.WorkOrderOperationSet.results),
      operations: this.cleanOperation(rawWorkOrder.WorkOrderOperationSet.results),
      timeProgress: this.getTimeProgress(this.getEstimatedTime(rawWorkOrder.WorkOrderOperationSet.results), this.getActualTime(rawWorkOrder.WorkOrderOperationSet.results)),
      technician: assignedTechnician
    })
  }

  setAssigneeAndWorkCenter = async (params) => {
    let req = {
      workOrderID: params.workOrderID,
      details: {
        ARBPL: params.workCenter.workCenterKey,
        ENAME: params.assignee.personName,
        PARNR: params.assignee.personKey,
      }
    }
    let res = await this._appService._putDataToGateway(environment.mccAbapApiUrl, 'workOrdersAndOperations', req);
    return res;
  }

  getAssignedTechnician = (technicians, rawWorkOrder) =>{
    let assignedTechnician = null;
    if (technicians[`${rawWorkOrder.ARBPL}`]) {
      assignedTechnician = technicians[rawWorkOrder.ARBPL].filter(technician => {
        let condition = parseInt(technician.personKey) === parseInt(rawWorkOrder.PARNR)
        return condition
      })
    }
    return assignedTechnician;
  }


  getWorkOrderByID = async (id) => {
    let rawWorkOrder$ = await this._appService._getRespFromGateway(environment.mccAbapApiUrl, `workOrder/${id}`)
    let workOrder$ = combineLatest([rawWorkOrder$, this.technicians$]).pipe(map(([rawWorkOrder, technicians]) => {
      let workOrders: WorkOrders = { unassigned: [], assigned: [], inProgress: [], completed: [] };
      let workOrder: WorkOrder;
      let assignedTechnician = this.getAssignedTechnician(technicians, rawWorkOrder)
      workOrder = this.cleanWorkOrder(rawWorkOrder, assignedTechnician)
      workOrders[`${workOrder.status}`].push(workOrder)
      return workOrders;
    }))

    workOrder$.subscribe(resp => console.log("cleaned", resp))
    return workOrder$
  }
}

