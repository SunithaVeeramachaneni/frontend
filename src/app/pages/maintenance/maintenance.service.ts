import { Injectable, NgZone } from "@angular/core"
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { ErrorInfo } from "../../interfaces/error-info";
import { WorkOrder, WorkOrders } from "../../interfaces/work-order";
import { AppService } from "../../shared/services/app.services"
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: "root" })
export class MaintenanceService {
  constructor(private _zone: NgZone, private _appService: AppService) { }

  private transformedObservable$;

  private selectOptions: string[] = ['PRIOK', 'PRIOKX', 'COLOUR', 'AUFNR', 'AUFTEXT', 'ARBPL', 'KTEXT', 'PARNR', 'IPHAS', 'WorkOrderOperationSet/STATUS', 'WorkOrderOperationSet/ARBEI', 'IPHAS', 'GSTRP']

  private statusMap = {
    "CRTD": "assigned",
    "REL": "inProgress",
    "TECO": "completed"
  }

  getServerSentEvent(url: string): Observable<WorkOrders> {
    return new Observable(observer => {
      // console.log("Getting server sent event")
      const eventSource = new EventSource(this._appService.prepareUrl(environment.mccAbapApiUrl,'updateWorkOrders'))
      eventSource.onmessage = event => {
        // console.log("Event", JSON.parse(event.data));
        let workOrders: WorkOrders = { unassigned: [], assigned: [], inProgress: [], completed: [] };
        let workOrder: WorkOrder;
        let rawWorkOrders = JSON.parse(event.data);
        rawWorkOrders.forEach(rawWorkOrder => {
          workOrder = this.cleanWorkOrder(rawWorkOrder)
          workOrders[`${workOrder.status}`].push(workOrder)
        });

        console.log("The raw work order is", rawWorkOrders);
        if(rawWorkOrders !== []){
        this._zone.run(() => {
        observer.next(workOrders);
        });
        
        }
      }
    });
  }

  getAllWorkOrders(pagination: boolean = true, info: ErrorInfo = {} as ErrorInfo): Observable<WorkOrders> {
    const params: any = {selectOptions: this.selectOptions, collectionComponent: 'WorkOrdersCollection'}
    let workOrders$ = this._appService._getRespFromGateway(environment.mccAbapApiUrl, 'workOrdersAndOperations/WorkOrderOperationSet', info);
    this.transformedObservable$ = workOrders$.pipe(map(rawWorkOrders => {
      let workOrders: WorkOrders = { unassigned: [], assigned: [], inProgress: [], completed: [] };
      let workOrder: WorkOrder;
      rawWorkOrders.forEach(rawWorkOrder => {
        workOrder = this.cleanWorkOrder(rawWorkOrder)
        workOrders[`${workOrder.status}`].push(workOrder)
      });
      return workOrders;
    }))
    return this.transformedObservable$
  }

  parseJsonDate(jsonDateString) {
    return new Date(parseInt(jsonDateString.replace('/Date(', '')));
  }

  formatTime = (inputHours) => { //move to utils directory
    inputHours = parseInt(inputHours);
    const minutes = Math.floor(inputHours % 1 * 60);
    const hours = Math.floor(inputHours);
    if (minutes !== 0)
      if( hours === 1)
        return `${hours} hr ${minutes} min`
      else
      return `${hours} hrs ${minutes} min`
    else
    if( hours === 1)
      return `${hours} hr`
    else 
      return `${hours} hrs`
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

  getOperationProgress = (operations) => {
    let totalNoOfOperations = 0;
    let noOfCompletedOperations = 0;
    operations.forEach(operation => {
      totalNoOfOperations += 1;
      if (operation.STATUS === 'CNF')
        noOfCompletedOperations += 1;
    });
    let completedOperationsProgressBar= (1 / totalNoOfOperations) * noOfCompletedOperations;
    return [noOfCompletedOperations, totalNoOfOperations, completedOperationsProgressBar];
  }

  getTimeProgress = (estimatedTime, actualTime) => {
    console.log("estimated time", estimatedTime, "actual time",actualTime);
    let timeProgress = actualTime/estimatedTime
    return timeProgress;
  }

  getStatus(personDetails, status) {
    if (!personDetails) return 'unassigned'
    else return this.statusMap[`${status}`]
  }

  cleanOperationTime = (operations) =>{
    let cleaned = operations.map(operation =>{
      return ({
        "actualTime": this.formatTime(operation.ISMNW),
        "estimatedTime": this.formatTime(operation.ARBEI),
        "timeProgress": operation.ISMNW/operation.ARBEI
      })
    })
    console.log("Operation Details", cleaned)
    return cleaned

  }

  cleanWorkOrder(rawWorkOrder) {
    return ({
      status: rawWorkOrder['PARNR'] ? this.statusMap[`${rawWorkOrder['IPHAS']}`] : 'unassigned',
      personDetails: rawWorkOrder['PARNR'],
      priorityNumber: rawWorkOrder['PRIOK'],
      priorityStatus: rawWorkOrder['PRIOKX'],
      colour: rawWorkOrder['COLOUR'],
      workOrderID: rawWorkOrder['AUFNR'],
      workOrderDesc: rawWorkOrder['AUFTEXT'],
      equipmentID: rawWorkOrder['ARBPL'],
      equipmentName: rawWorkOrder['KTEXT'],
      kitStatus: rawWorkOrder['TXT04'],
      dueDate: this.parseJsonDate(rawWorkOrder['GSTRP']),
      estimatedTime: this.formatTime(this.getEstimatedTime(rawWorkOrder.WorkOrderOperationSet.results)),
      actualTime: this.formatTime(this.getActualTime(rawWorkOrder.WorkOrderOperationSet.results)),
      operationProgress: this.getOperationProgress(rawWorkOrder.WorkOrderOperationSet.results),
      operations: this.cleanOperationTime(rawWorkOrder.WorkOrderOperationSet.results),
      timeProgress: this.getTimeProgress(this.getEstimatedTime(rawWorkOrder.WorkOrderOperationSet.results), this.getActualTime(rawWorkOrder.WorkOrderOperationSet.results))
    })
  }

}