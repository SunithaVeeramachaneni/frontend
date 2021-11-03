import { Injectable } from "@angular/core"
import { interval, Observable, Subject, timer } from "rxjs";
import { catchError, map, retry, share, switchMap, takeUntil, tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { ErrorInfo } from "../../interfaces/error-info";
import { WorkOrder, WorkOrders } from "../../interfaces/scc-work-order";
import { Technician, Technicians } from "../../interfaces/technicians";
import { AppService } from "../../shared/services/app.services";
import * as moment from 'moment';

@Injectable({ providedIn: "root" })
export class SparepartsService {

  constructor(private _appService: AppService) { }

  private statusMap = {
    "1": "Kits Required",
    "2": "Assigned for Picking",
    "3": "Kitting in Progress",
    "4": "Kits Complete",
    "5": "Kits Issued",
  }



  private stopPolling = new Subject();

  ngOnDestroy = () =>{
    this.stopPolling.next();
  }
  getPickerList(info: ErrorInfo = {} as ErrorInfo):Observable<Technician[]>{
    let technicians$ = this._appService._getRespFromGateway(environment.spccAbapApiUrl,'pickerlist', info);
    let transformedObservable$ = technicians$.pipe(map(rawTechnicians => {
      let technicians: Technician[] =[]
      let technician: Technician;
      rawTechnicians.forEach(rawTechnician => {
        technician = ({
          userName: rawTechnician['UserName'],
          userId: rawTechnician['UserID'],
          fName:rawTechnician['FirstName'],
          LName:rawTechnician['LastName']
        })
        technicians.push(technician)
      });
      return technicians;
    }),
     share()
     )
    return transformedObservable$;
  }
  assignTechnicianToWorkorder(data,info: ErrorInfo = {} as ErrorInfo):Observable<any>{
    let updateResp$ = this._appService._putDataToGateway(environment.spccAbapApiUrl,`workorderspcc/${data.AUFNR}`,data);
    return updateResp$;
  }

  getAllWorkOrders(dateRange,pagination: boolean = true, info: ErrorInfo = {} as ErrorInfo): Observable<WorkOrders> {
    let workOrders$ = timer(1, 1000 * 60 * 2).pipe(
      switchMap(() => this._appService._getRespFromGateway(environment.spccAbapApiUrl,`workorderspcc?startdate=${dateRange['startDate']}&enddate=${dateRange['endDate']}`, info)),
      retry(3),
      share(),
      takeUntil(this.stopPolling)
    );
    let transformedObservable$ = workOrders$.pipe(map(rawWorkOrders => {
      let workOrders: WorkOrders = { "1": [], "2": [], "3": [], "4": [],"5":[] };
      let workOrder: WorkOrder;
      rawWorkOrders.forEach(rawWorkOrder => {
        workOrder = ({
          statusCode:rawWorkOrder['STATUSKEY'],
          status: this.statusMap[`${rawWorkOrder['STATUSKEY']}`],
          personDetails: "",
          //rawWorkOrder['PARNR'],
          priorityNumber: rawWorkOrder['PRIOK'],
          priorityStatus: rawWorkOrder['PRIOKX']?rawWorkOrder['PRIOKX']+" Priority":"",
          colour: "",
          //rawWorkOrder['COLOUR'],
          workOrderID: rawWorkOrder['AUFNR'],
          workOrderDesc: "",
          //rawWorkOrder['AUFTEXT'],
          equipmentID: "",
          //rawWorkOrder['ARBPL'],
          equipmentName: "",
          //rawWorkOrder['KTEXT'],
          kitStatus: rawWorkOrder['TXT04'],
          dueDate: this.parseJsonDate(rawWorkOrder['GSTRP']),
          estimatedTime: '',
          actualTime: '',
          progress: rawWorkOrder['PROGRESS'],
          partsavailable:rawWorkOrder['PARTS_AVAIL']?"PARTS AVAILABLE":"WAITING ON PARTS",
          progressValue:rawWorkOrder['STAGED']/rawWorkOrder['TOTITEMS'],
          staged:rawWorkOrder['STAGED'],
          totItems:rawWorkOrder['TOTITEMS'],
          assigneeId:rawWorkOrder['USNAM'],
          assignee:rawWorkOrder['ASSIGNEE']
        })
        workOrders[`${workOrder.statusCode}`].push(workOrder)
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