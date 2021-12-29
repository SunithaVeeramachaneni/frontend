import { TestBed } from "@angular/core/testing";
import { rawWorkOrders$, expectedWorkOrders$, expectedARBPLs$, rawARBPLs$, rawTechniciansELEKTRIK$, rawTechniciansMECHANIK$, rawTechniciansARBITRARY$, expectedTechnicians$, unassignedWorkOrder1 } from "./maintenance.mock"
import { MaintenanceService } from "./maintenance.service";
import { AppService } from "../../shared/services/app.services"
import { WorkOrders } from "../../interfaces/work-order";
import { isEqual, isObject } from "lodash";
import * as _ from "lodash";
import { HttpClientModule } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { of } from "rxjs";
import { worker } from "cluster";
// import { first } from "rxjs/operators";

describe('Maintenance service', () => {
  let service: MaintenanceService;
  let appServiceSpy: AppService;
  let maintenanceServiceSpy: MaintenanceService

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
    appServiceSpy = jasmine.createSpyObj('AppService', [
      '_getRespFromGateway', 'prepareUrl'], {}
    );


    TestBed.configureTestingModule({
      providers: [MaintenanceService,
        { provide: AppService, useValue: appServiceSpy }],
      imports: []
    });
    service = TestBed.inject(MaintenanceService);
  });

  it('needs to exist', () => {
    expect(service).toBeTruthy();
  })

  it('needs to process raw list of work centers and return them', () => {
    let workCenters;
    let gateWayParams = `workCenters/${1000}`;
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, gateWayParams)
      .and.returnValue(rawARBPLs$);
    let workCenters$ = service.getAllWorkCenters()
    let expectedWorkCenters;
    expectedARBPLs$.subscribe(resp => workCenters = resp);
    workCenters$.subscribe(resp => expectedWorkCenters = resp);
    expect(isEqual(workCenters, expectedWorkCenters)).toBeTrue();
  })

  it('needs to process raw technicians and return them', () => {
    let gateWayParams = `workCenters/${1000}`;
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, gateWayParams)
      .and.returnValue(rawARBPLs$).and.callThrough();



    (appServiceSpy._getRespFromGateway as jasmine.Spy)
    .withArgs(environment.mccAbapApiUrl, `technicians/'ELEKTRIK'`)
    .and.returnValue(rawTechniciansELEKTRIK$).and.callThrough();
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
    .withArgs(environment.mccAbapApiUrl, `technicians/'MECHANIK'`)
    .and.returnValue(rawTechniciansMECHANIK$).and.callThrough();
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
    .withArgs(environment.mccAbapApiUrl, `technicians/'ARBITRARY'`)
    .and.returnValue(rawTechniciansARBITRARY$).and.callThrough();
    service.getAllWorkCenters()


    let technicians$ = service.getTechnicians();
    let technicians
    let expectedTechnicians;
    expectedTechnicians$.subscribe(resp => expectedTechnicians = resp);
    technicians$.subscribe(resp => technicians = resp);
    expect(isEqual(expectedTechnicians, technicians)).toBeTrue();

  })

  it('needs to process raw data and return Work Orders', () => {
        let gateWayParams = `workCenters/${1000}`;
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, gateWayParams)
      .and.returnValue(rawARBPLs$).and.callThrough();
      service.getAllWorkCenters();


      (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, `technicians/'ELEKTRIK'`)
      .and.returnValue(rawTechniciansELEKTRIK$).and.callThrough();
      (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, `technicians/'MECHANIK'`)
      .and.returnValue(rawTechniciansMECHANIK$).and.callThrough();
      (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, `technicians/'ARBITRARY'`)
      .and.returnValue(rawTechniciansARBITRARY$).and.callThrough();
      service.getTechnicians();

      (appServiceSpy._getRespFromGateway as jasmine.Spy).withArgs(environment.mccAbapApiUrl, 'workOrdersAndOperations/WorkOrderOperationSet')
      .and.returnValue(rawWorkOrders$).and.callThrough();
      

    let workOrders$ = service.getAllWorkOrders()
    let workOrders: WorkOrders;
    let expectedWorkOrders: WorkOrders;
    workOrders$.subscribe((resp) => workOrders = resp);
    expectedWorkOrders$.subscribe((resp) => expectedWorkOrders = resp);
    expect(isEqual(workOrders, expectedWorkOrders)).toBeTrue();
  })


  it('parseJsonData should take string date and convert to a date object', () => {
    let stringDate: string = '/Date(1629331200000)/';
    let expectedDate: Date = new Date(1629331200000);
    let convertedDate: Date = service.parseJsonDate(stringDate);
    expect(isEqual(convertedDate, expectedDate)).toBeTrue();
  })

  it('formatTime should convert an integer amount of hours into a string', () => {
    let timeInHours: number;
    let formattedTime: string;
    let expectedTime: string;

    timeInHours = 5;
    formattedTime = service.formatTime(timeInHours);
    expectedTime = '5 hrs';

    expect(isEqual(formattedTime, expectedTime)).toBeTrue();

    timeInHours = 5.5;
    formattedTime = service.formatTime(timeInHours);
    expectedTime = '5 hrs 30 min'

    expect(isEqual(formattedTime, expectedTime)).toBeTrue();
  })

  it('getEstimatedTime should add up the estimated time of all work operations and return it', () => {
    let operations: any[] = [{ ARBEI: 5 }, { ARBEI: 10 }, { ARBEI: 3 }]
    let expectedTime: number = 18;
    let time: number = service.getEstimatedTime(operations);

    expect(isEqual(expectedTime, time)).toBeTrue();
  })

  it('getActualTime should add up the actual time of all work operations and return it', () => {
    let operations: any[] = [{ ISMNW: 3 }, { ISMNW: 4 }, { ISMNW: 3 }]
    let expectedTime: number = 10;
    let time: number = service.getActualTime(operations);

    expect(isEqual(expectedTime, time)).toBeTrue();
  })

  it('getProgress should return an array depicting the progress of a workOrder', () => {
    let operations: any[];
    let expectedProgress: any[];
    let progress: number[];

    operations = [{ STATUS: 'CRTD' }, { STATUS: 'REL' }, { STATUS: 'PCNF' }, { STATUS: 'CNF' }];
    expectedProgress = [1, 4, 1/4];
    progress = service.getOperationProgress(operations);

    expect(isEqual(progress, expectedProgress)).toBeTrue();

    operations = [{ STATUS: 'CNF' }, { STATUS: 'CNF' }, { STATUS: 'CNF' }];
    expectedProgress = [3, 3, 1];
    progress = service.getOperationProgress(operations);

    expect(isEqual(progress, expectedProgress)).toBeTrue();


  })

  it('getStatus should return the corresponding status of the workOrder', () => {
    let personDetails = '';
    let rawStatus = 'CRTD'

    let status = service.getStatus(personDetails, rawStatus);
    expect(isEqual(status, 'unassigned')).toBeTrue()

    personDetails = '001';
    rawStatus = 'CRTD'

    status = service.getStatus(personDetails, rawStatus);
    expect(isEqual(status, 'assigned')).toBeTrue()

    personDetails = '001';
    rawStatus = 'REL'

    status = service.getStatus(personDetails, rawStatus);
    expect(isEqual(status, 'inProgress')).toBeTrue()

    personDetails = '001';
    rawStatus = 'TECO'

    status = service.getStatus(personDetails, rawStatus);
    expect(isEqual(status, 'completed')).toBeTrue()

  })


  it('should get server sent event and add to existing work orders', () => {
    (appServiceSpy.prepareUrl as jasmine.Spy)
    .withArgs(environment.mccAbapApiUrl, 'updateWorkOrders')
    .and.returnValue(new Event('[]')).and.callThrough();
    expect(service.getServerSentEvent('123')).toBeDefined();
  })

  it('should get work order by id', async () =>{

    let gateWayParams = `workCenters/${1000}`;
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.mccAbapApiUrl, gateWayParams)
      .and.returnValue(rawARBPLs$).and.callThrough();



    (appServiceSpy._getRespFromGateway as jasmine.Spy)
    .withArgs(environment.mccAbapApiUrl, `technicians/'ELEKTRIK'`)
    .and.returnValue(rawTechniciansELEKTRIK$).and.callThrough();
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
    .withArgs(environment.mccAbapApiUrl, `technicians/'MECHANIK'`)
    .and.returnValue(rawTechniciansMECHANIK$).and.callThrough();
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
    .withArgs(environment.mccAbapApiUrl, `technicians/'ARBITRARY'`)
    .and.returnValue(rawTechniciansARBITRARY$).and.callThrough();
    service.getAllWorkCenters()


    service.getTechnicians();
    let rawWorkOrders;
    rawWorkOrders$.subscribe(resp => rawWorkOrders = resp);
    let firstRawWorkOrder$ = of(rawWorkOrders[0]);
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
    .withArgs(environment.mccAbapApiUrl, 'workOrder/24')
    .and.returnValue(firstRawWorkOrder$).and.callThrough();
    let workorder$ = await service.getWorkOrderByID(24);
    let workorder;
    let workorders = {'unassigned': [unassignedWorkOrder1], 'assigned': [], 'inProgress':[], 'completed': []}
    workorder$.subscribe(resp => workorder = resp);  
    expect(isEqual(workorders, workorder)).toBeTrue()
  })


})