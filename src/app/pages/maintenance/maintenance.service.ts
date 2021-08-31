import { Injectable } from "@angular/core"
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { ErrorInfo } from "../../interfaces/error-info";
import { WorkOrder, WorkOrders } from "../../interfaces/work-order";
import { AppService } from "../../services/app.service"

@Injectable({ providedIn: "root" })
export class MaintenanceService {

  constructor(private _appService: AppService) { }

  private selectOptions: string[] =['PRIOK', 'PRIOKX', 'COLOUR', 'AUFNR', 'AUFTEXT', 'ARBPL', 'KTEXT', 'PARNR','IPHAS', 'WorkOrderOperationSet/STATUS','WorkOrderOperationSet/ARBEI', 'IPHAS', 'GSTRP']

  private statusMap = {
    "CRTD": "assigned",
    "REL": "inProgress",
    "TECO": "completed"
  }

  getAllWorkOrders(pagination: boolean = true, info: ErrorInfo = {} as ErrorInfo): Observable<WorkOrders> {
    const params: any = {selectOptions: this.selectOptions, collectionComponent: 'WorkOrdersCollection'}
    let workOrders$ = this._appService._getRespFromGateway('workOrdersAndOperations/WorkOrderOperationSet', info);
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
          estimatedTime: this.formatTime(this.getEstimatedTime(rawWorkOrder.WorkOrderOperationSet.results)),
          actualTime: this.formatTime(this.getActualTime(rawWorkOrder.WorkOrderOperationSet.results)),
          progress: this.getProgress(rawWorkOrder.WorkOrderOperationSet.results)
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

  getEstimatedTime = (operations) => {
    let time = 0
    operations.forEach(operation => {
      time += operation.ARBEI
    });
    return time;
  }

  getActualTime = (operations) => {
    let time = 0
    operations.forEach(operation => {
      time += operation.ISMNW
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

}