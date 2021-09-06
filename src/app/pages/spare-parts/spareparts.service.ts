import { Injectable } from "@angular/core"
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { ErrorInfo } from "../../interfaces/error-info";
import { WorkOrder, WorkOrders } from "../../interfaces/scc-work-order";
import { Technician, Technicians } from "../../interfaces/technicians";
import { AppService } from "../../shared/services/app.services"

@Injectable({ providedIn: "root" })
export class SparepartsService {

  constructor(private _appService: AppService) { }

  private statusMap = {
    "CRTD": "assingedforpicking",
    "REL": "kittinginprogress",
    "TECO": "kitscomplete"
  }
  getTechnicians(info: ErrorInfo = {} as ErrorInfo):Observable<Technicians>{
    let technicians$ = this._appService._getRespFromGateway(environment.spccAbapApiUrl,'technicians', info);
    let transformedObservable$ = technicians$.pipe(map(rawTechnicians => {
      let technicians: Technicians = { technicians:[] };
      let technician: Technician;
      rawTechnicians.forEach(rawTechnician => {
        console.log(rawTechnician)
        technician = ({
          personName: rawTechnician['PERNRDesc'],
          personKey: rawTechnician['PERNRKey']
        })
        technicians['technicians'].push(technician)
      });
      return technicians;
    }))
    return transformedObservable$;
  }

  getAllWorkOrders(pagination: boolean = true, info: ErrorInfo = {} as ErrorInfo): Observable<WorkOrders> {
    console.log("getAllWorkOrders")
    //workOrdersAndOperations/WorkOrderComponentSet
    let workOrders$ = this._appService._getRespFromGateway(environment.spccAbapApiUrl,'sccmock', info);
    let transformedObservable$ = workOrders$.pipe(map(rawWorkOrders => {
      let workOrders: WorkOrders = { kitsrequired: [], assingedforpicking: [], kittinginprogress: [], kitscomplete: [],kitspickedup:[] };
      let workOrder: WorkOrder;
      rawWorkOrders.forEach(rawWorkOrder => {
        workOrder = ({
          status: rawWorkOrder['PARNR'] ? this.statusMap[`${rawWorkOrder['IPHAS']}`]: 'kitsrequired',
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
          estimatedTime: '',
          actualTime: '',
          progress: rawWorkOrder['PROGRESS'],
          partsavailable:rawWorkOrder['TXT04'],
          partscolor:rawWorkOrder['TXT04-C'],
          progressValue:rawWorkOrder['PROGRESS'][0]/rawWorkOrder['PROGRESS'][1]
        })
        workOrders[`${workOrder.status}`].push(workOrder)
      });
      return workOrders;
    }))
    console.log(transformedObservable$)
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
    if (!personDetails) return 'Unassigned'
    else return this.statusMap[`${status}`]
  }

}