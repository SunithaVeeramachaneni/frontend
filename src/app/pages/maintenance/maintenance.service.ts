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
      // console.log("Getting server sent event")
      const eventSource = new EventSource(this._appService.prepareUrl(environment.mccAbapApiUrl, 'updateWorkOrders'))
      eventSource.onmessage = event => {
        // console.log("Event", JSON.parse(event.data));
        let workOrders: WorkOrders = { unassigned: [], assigned: [], inProgress: [], completed: [] };
        let workOrder: WorkOrder;
        let rawWorkOrders = JSON.parse(event.data);
        rawWorkOrders.forEach(rawWorkOrder => {
          workOrder = this.cleanWorkOrder(rawWorkOrder)//, "")
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
    this.workOrders$ = combineLatest([workOrders$]).pipe(map(([rawWorkOrders]) => { //, this.technicians$
      let workOrders: WorkOrders = { unassigned: [], assigned: [], inProgress: [], completed: [] };
      let workOrder: WorkOrder;
      rawWorkOrders.forEach(rawWorkOrder => {
        // console.log("Technicians are", technicians)
        // console.log("Stringiefied", JSON.stringify(technicians));
        // for(let key in technicians.keys())console.log("Key is", key)
        // console.log("Raw work order's ARBPL is", rawWorkOrder.ARBPL)
        // console.log("Hardcoded selection is", technicians.ELEKTRIK)
        // console.log("The selection is",technicians[`${rawWorkOrder.ARBPL}`] )
        // let assignedTechnician = technicians[rawWorkOrder.ARBPL].filter(technician => technician.personKey === rawWorkOrder.PARNR)
        workOrder = this.cleanWorkOrder(rawWorkOrder)//, assignedTechnician)
        workOrders[`${workOrder.status}`].push(workOrder)
      });
      return workOrders;
    }))
    return this.workOrders$
  }

  parseJsonDate(jsonDateString) {
    return new Date(parseInt(jsonDateString.replace('/Date(', '')));
  }

  formatTime = (inputHours) => { //move to utils directory
    inputHours = parseInt(inputHours);
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
    this.technicians$ =  this.workCenters$.pipe(mergeMap(workCenters =>
      from(workCenters).pipe(
        mergeMap(workCenter =>
          this._appService._getRespFromGateway(environment.mccAbapApiUrl, `technicians/'${workCenter.workCenterKey}'`).pipe(tap(data =>{
            console.log("Data: ",data);
            console.log("WorkCenter", workCenter);
          }),
          map(technicians =>{
            let res = ({[workCenter.workCenterKey]:technicians});
            console.log("The assembled object is", res)

            
            return ({
            [workCenter.workCenterKey]:this.cleanTechnicians(technicians)
          })}
          
          ))),
      )),
      reduce((acc: any, cur)=>{
        console.log("cur is", cur);
        console.log("acc is", acc);
        return acc = {...acc, ...cur}
      },{})
    )
    
    // this.workCenters$.pipe(map(workCenters =>{
    //   workCenters.forEach(workCenter=>{
    //     this._appService._getRespFromGateway(environment.mccAbapApiUrl, `technicians/'${workCenter.workCenterKey}'`).pipe([worke]

        // )

          // .subscribe(
          //   resp => {
          //     console.log("Testing 123")
          //     technicians[workCenter.workCenterKey] = this.cleanTechnicians(resp)})
    //         })
    //         this.technicians$.next(technicians)
    // return workCenters  
    // })).subscribe(resp => console.log("Necessary subscription"))
    // return this.technicians$;
    return this.technicians$
  }
  
  cleanTechnicians = (rawTechnicians):Technician[] =>{
    let technicians  = rawTechnicians.map( rawTechnician =>{
    return ({
      personName: rawTechnician.PERNRDesc,
      personKey: rawTechnician.PERNRKey,
      image: rawTechnician.Filecontent
    })
  })
  return technicians;
}

  getEstimatedTime = (operations) => {
    let time = 0
    operations.forEach(operation => {
      time += parseInt(operation.ARBEI)
    });
    return time;
  }

  getActualTime = (operations) => {
    let time = 0
    operations.forEach(operation => {
      time += parseInt(operation.ISMNW)
    });
    return time;
  }

  getProgress = (operations) => {
    let totalNoOfOperations = 0;
    let noOfCompletedOperations = 0;
    operations.forEach(operation => {
      totalNoOfOperations += 1;
      if (operation.STATUS === 'CNF')
        noOfCompletedOperations += 1;
    });
    return [noOfCompletedOperations, totalNoOfOperations]
  }

  getStatus(personDetails, status) {
    if (!personDetails) return 'unassigned'
    else return this.statusMap[`${status}`]
  }

  cleanWorkOrder(rawWorkOrder){//, assignedTechnician) {
    return ({
      status: rawWorkOrder['PARNR'] ? this.statusMap[`${rawWorkOrder['IPHAS']}`] : 'unassigned',
      personDetails: rawWorkOrder['PARNR'],
      priorityNumber: rawWorkOrder['PRIOK'],
      priorityStatus: rawWorkOrder['PRIOKX'],
      colour: rawWorkOrder['COLOUR'],
      workOrderID: rawWorkOrder['AUFNR'],
      workOrderDesc: rawWorkOrder['AUFTEXT'],
      workCenter: rawWorkOrder['ARBPL'],
      equipmentName: rawWorkOrder['KTEXT'],
      kitStatus: rawWorkOrder['TXT04'],
      dueDate: this.parseJsonDate(rawWorkOrder['GSTRP']),
      estimatedTime: this.formatTime(this.getEstimatedTime(rawWorkOrder.WorkOrderOperationSet.results)),
      actualTime: this.formatTime(this.getActualTime(rawWorkOrder.WorkOrderOperationSet.results)),
      progress: this.getProgress(rawWorkOrder.WorkOrderOperationSet.results),
      operations: rawWorkOrder.WorkOrderOperationSet.results,
      // technician: assignedTechnician
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
    let res =  await this._appService._putDataToGateway(environment.mccAbapApiUrl, 'workOrdersAndOperations', req);
    return res;
  }
}

