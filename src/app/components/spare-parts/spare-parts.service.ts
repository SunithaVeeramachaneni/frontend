/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { map, retry, share, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ErrorInfo } from '../../interfaces/error-info';
import { WorkOrders } from '../../interfaces/scc-work-order';
import { WarehouseTechnician } from '../../interfaces/warehouse_technicians';
import { AppService } from '../../shared/services/app.services';

@Injectable({ providedIn: 'root' })
export class SparepartsService {
  workOrders$ = null;
  public emptyWorkOrders: WorkOrders = {
    '1': [],
    '2': [],
    '3': [],
    '4': [],
    '5': []
  };

  private statusMap = {
    '1': 'Kits Required',
    '2': 'Assigned for Picking',
    '3': 'Kitting in Progress',
    '4': 'Kits Complete',
    '5': 'Kits Issued'
  };

  private stopPolling = new Subject();

  constructor(private _appService: AppService) {}

  stopSeamlessUpdate() {
    this.stopPolling.next();
    this.stopPolling.complete();
  }

  getPickerList(): Observable<WarehouseTechnician[]> {
    return this._appService._getRespFromGateway(
      environment.spccAbapApiUrl,
      'pickerlist'
    );
  }

  assignTechnicianToWorkorder(
    data,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    const updateResp$ = this._appService._putDataToGateway(
      environment.spccAbapApiUrl,
      `workorderspcc/${data.AUFNR}`,
      data
    );
    return updateResp$;
  }

  getWorkOrderByID(id) {
    const rawWorkOrder$ = this._appService._getRespFromGateway(
      environment.mccAbapApiUrl,
      `workOrderSPCC/${id}`
    );
    return rawWorkOrder$.pipe(
      map((workOrder) => {
        const newWorkOrderList = {
          ...this.emptyWorkOrders,
          [workOrder.statusCode]: [workOrder]
        };
        return newWorkOrderList;
      })
    );
  }

  getAllWorkOrders(
    dateRange,
    pagination: boolean = true,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<WorkOrders> {
    if (this.workOrders$) {
      this.stopPolling.next();
      this.stopPolling.complete();
      this.stopPolling = new Subject();
    }
    this.workOrders$ = timer(1, 1000 * 10 * 2).pipe(
      switchMap(() =>
        this._appService._getRespFromGateway(
          environment.spccAbapApiUrl,
          `workorderspcc?startdate=${dateRange.startDate}&enddate=${dateRange.endDate}`
        )
      ),
      retry(3),
      share(),
      takeUntil(this.stopPolling)
    );
    return this.workOrders$;
  }

  parseJsonDate(jsonDateString) {
    return new Date(parseInt(jsonDateString.replace('/Date(', '')));
  }

  getStatus(personDetails, status) {
    if (!personDetails) return 'Unassigned';
    else return this.statusMap[`${status}`];
  }
}
