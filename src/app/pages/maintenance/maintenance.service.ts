import { Injectable } from "@angular/core"
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { ErrorInfo } from "../../interfaces/error-info";
import { WorkOrder, WorkOrders } from "../../interfaces/work-order";
import { AppService } from "../../services/app.service"

@Injectable({ providedIn: "root" })
export class MaintenanceService {

  constructor(private _appService: AppService) { }

  private statusMap = {
    "CRTD": "assigned",
    "REL": "inProgress",
    "TECO": "completed"
  }

  getAllWorkOrders(pagination: boolean = true, info: ErrorInfo = {} as ErrorInfo): Observable<WorkOrders> {
    let workOrders$ = this._appService._getRespFromGateway('workOrdersAndOperations', info);
    let transformedObservable$ = workOrders$.pipe(map(rawWorkOrders => {
      let workOrders: WorkOrders = { unassigned: [], assigned: [], inProgress: [], completed: [] };
      let workOrder: WorkOrder;
      rawWorkOrders.forEach(rawWorkOrder => {
        workOrder = ({
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
          estimatedTime: this.formatTime(this.getEstimatedTime(rawWorkOrder)),
          actualTime: this.formatTime(this.getActualTime(rawWorkOrder)),
          progress: this.getProgress(rawWorkOrder)
        })
        workOrders[`${workOrder.status}`].push(workOrder)
      });
      return workOrders;
    }))
    return transformedObservable$
  }

  parseJsonDate(jsonDateString) {
    return new Date(parseInt(jsonDateString.replace('/Date(', '')));
  }

  formatTime = (inputHours) => { //move to utils directory
    const minutes = Math.floor(inputHours % 1 * 60);
    const hours = Math.floor(inputHours);
    if (minutes !== 0)
      return `${hours} hrs ${minutes} min`
    else
      return `${hours} hrs`
  }

  getEstimatedTime = (workOrder) => {
    let time = 0
    workOrder.WorkOrderOperationSet.results.forEach(operation => {
      time += operation.ARBEI
    });
    return time;
  }

  getActualTime = (workOrder) => {
    let time = 0
    workOrder.WorkOrderOperationSet.results.forEach(operation => {
      time += operation.ISMNW
    });
    return time;
  }

  getProgress = (workOrder) => {
    let totalNoOfOperations = 0;
    let noOfCompletedOperations = 0;
    workOrder.WorkOrderOperationSet.results.forEach(operation => {
      totalNoOfOperations += 1;
      if (operation.STATUS === 'cnf')
        noOfCompletedOperations += 1;
    });
    return [noOfCompletedOperations, totalNoOfOperations]
  }

  getStatus(personDetails, status) {
    if (!personDetails) return 'Unassigned'
    else return this.statusMap[`${status}`]
  }

}