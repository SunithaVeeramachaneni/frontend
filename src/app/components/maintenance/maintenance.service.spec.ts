import { TestBed } from '@angular/core/testing';
import {
  rawWorkOrders$,
  expectedWorkOrders$,
  expectedARBPLs$,
  rawARBPLs$,
  rawTechniciansELEKTRIK$,
  rawTechniciansMECHANIK$,
  rawTechniciansARBITRARY$,
  expectedTechnicians$,
  unassignedWorkOrder1Card
} from './maintenance.mock';
import { MaintenanceService } from './maintenance.service';
import { AppService } from '../../shared/services/app.services';
import { WorkOrders } from '../../interfaces/work-order';
import { isEqual, isObject } from 'lodash';
import * as _ from 'lodash';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
// import { first } from "rxjs/operators";

describe('Maintenance service', () => {
  let service: MaintenanceService;
  let appServiceSpy: AppService;
  let maintenanceServiceSpy: MaintenanceService;

  beforeEach(() => {
    // maintenanceServiceSpy = jasmine.createSpyObj('MaintenanceService', [
    //   'getTechnicians',
    //   'getAllWorkCenters',
    //   'getAllWorkOrders',
    //   'parseJsonDate',
    //   'formatTime',
    //   'cleanTechnicians',
    //   'getEstimatedTime',
    //   'getActualTime',
    //   'getOperationProgress',
    //   'getTimeProgress',
    //   'getStatus'], {
    //   workCenters$: expectedARBPLs$
    // });
    appServiceSpy = jasmine.createSpyObj(
      'AppService',
      ['_getRespFromGateway', 'prepareUrl'],
      {}
    );

    TestBed.configureTestingModule({
      providers: [
        MaintenanceService,
        { provide: AppService, useValue: appServiceSpy }
      ],
      imports: []
    });
    service = TestBed.inject(MaintenanceService);
  });

  it('needs to exist', () => {
    expect(service).toBeTruthy();
  });

  it('needs to process raw list of work centers and return them', () => {
    let workCenters;
    let gateWayParams = `workCenters/${1000}`;
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, gateWayParams)
      .and.returnValue(rawARBPLs$);
    let workCenters$ = service.getAllWorkCenters();
    let expectedWorkCenters;
    expectedARBPLs$.subscribe((resp) => (workCenters = resp));
    workCenters$.subscribe((resp) => (expectedWorkCenters = resp));
    expect(isEqual(workCenters, expectedWorkCenters)).toBeTrue();
  });

  it('needs to process raw technicians and return them', () => {
    let gateWayParams = `workCenters/${1000}`;
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, gateWayParams)
      .and.returnValue(rawARBPLs$)
      .and.callThrough();

    (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, `technicians/'ELEKTRIK'`)
      .and.returnValue(rawTechniciansELEKTRIK$)
      .and.callThrough();
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, `technicians/'MECHANIK'`)
      .and.returnValue(rawTechniciansMECHANIK$)
      .and.callThrough();
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, `technicians/'ARBITRARY'`)
      .and.returnValue(rawTechniciansARBITRARY$)
      .and.callThrough();
    service.getAllWorkCenters();

    let technicians$ = service.getTechnicians();
    let technicians;
    let expectedTechnicians;
    expectedTechnicians$.subscribe((resp) => (expectedTechnicians = resp));
    technicians$.subscribe((resp) => (technicians = resp));
    expect(isEqual(expectedTechnicians, technicians)).toBeTrue();
  });

  it('needs to process raw data and return Work Order Cards', () => {
    let gateWayParams = `workCenters/${1000}`;
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, gateWayParams)
      .and.returnValue(rawARBPLs$)
      .and.callThrough();
    service.getAllWorkCenters();

    (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, `technicians/'ELEKTRIK'`)
      .and.returnValue(rawTechniciansELEKTRIK$)
      .and.callThrough();
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, `technicians/'MECHANIK'`)
      .and.returnValue(rawTechniciansMECHANIK$)
      .and.callThrough();
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, `technicians/'ARBITRARY'`)
      .and.returnValue(rawTechniciansARBITRARY$)
      .and.callThrough();
    service.getTechnicians();

    (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(
        environment.mccAbapApiUrl,
        'workOrdersAndOperations/WorkOrderOperationSet'
      )
      .and.returnValue(rawWorkOrders$)
      .and.callThrough();

    let workOrders$ = service.getAllWorkOrders();
    let workOrders: WorkOrders;
    let expectedWorkOrders;
    workOrders$.subscribe((resp) => {
      workOrders = resp;
    });
    expectedWorkOrders$.subscribe((resp) => (expectedWorkOrders = resp));
    console.log('workOrders', JSON.stringify(workOrders));
    console.log('expectedWorkOrders', JSON.stringify(expectedWorkOrders));
    expect(isEqual(workOrders, expectedWorkOrders)).toBeTrue();
  });

  it('should get server sent event and add to existing work orders', () => {
    (appServiceSpy.prepareUrl as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, 'updateWorkOrders')
      .and.returnValue(new Event('[]'))
      .and.callThrough();
    expect(service.getServerSentEvent('123')).toBeDefined();
  });

  it('should get work order by id', async () => {
    let gateWayParams = `workCenters/${1000}`;
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, gateWayParams)
      .and.returnValue(rawARBPLs$)
      .and.callThrough();

    (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, `technicians/'ELEKTRIK'`)
      .and.returnValue(rawTechniciansELEKTRIK$)
      .and.callThrough();
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, `technicians/'MECHANIK'`)
      .and.returnValue(rawTechniciansMECHANIK$)
      .and.callThrough();
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, `technicians/'ARBITRARY'`)
      .and.returnValue(rawTechniciansARBITRARY$)
      .and.callThrough();
    service.getAllWorkCenters();

    service.getTechnicians();
    let rawWorkOrders;
    rawWorkOrders$.subscribe((resp) => (rawWorkOrders = resp));
    let firstRawWorkOrder$ = of(rawWorkOrders[0]);
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, 'workOrder/24')
      .and.returnValue(firstRawWorkOrder$)
      .and.callThrough();
    let workorder$ = await service.getWorkOrderByID(24);
    let workorder;
    let workorders = {
      unassigned: [unassignedWorkOrder1Card],
      assigned: [],
      inProgress: [],
      completed: []
    };
    workorder$.subscribe((resp) => (workorder = resp));
    expect(workorders).toEqual(workorder);
  });
});
