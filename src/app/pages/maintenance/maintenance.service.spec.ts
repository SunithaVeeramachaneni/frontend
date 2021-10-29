import { TestBed } from "@angular/core/testing";
import { rawWorkOrders$, expectedWorkOrders$, expectedARBPLs$, rawARBPLs$, rawTechniciansELEKTRIK$, rawTechniciansMECHANIK$, rawTechnicians$ARBITRARY } from "./maintenance.mock"
import { MaintenanceService } from "./maintenance.service";
import { AppService } from "../../shared/services/app.services"
import { WorkOrders } from "../../interfaces/work-order";
import { isEqual, isObject } from "lodash";
import * as _ from "lodash";
import { HttpClientModule } from "@angular/common/http";
import { environment } from "../../../environments/environment";

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
      '_getRespFromGateway'], {}
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

  fit('needs to process raw technicians and return them', () => {
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
    .withArgs(environment.mccAbapApiUrl, `technicians/'ELEKTRIK'`)
    .and.returnValue(rawTechniciansELEKTRIK$);
    (appServiceSpy._getRespFromGateway as jasmine.Spy)
    .withArgs(environment.mccAbapApiUrl, `technicians/'MECHANIK'`)
    .and.returnValue(rawTechniciansMECHANIK$);


    let technicians$ = service.getTechnicians();
    // technicians$.subscribe(resp => console.log(resp));
    // let technicians
    // let expectedTechnicians;
    // expectedTechnicians$.subscribe(resp => expectedTechnicians = resp);
    // technicians$.subscribe(resp => technicians = resp);
    // expect(isEqual(expectedTechnicians, technicians)).toBeTrue();

  })

  xit('needs to process raw data and return Work Orders', () => {

    // spyOn(appService, '_getRespFromGateway').and.returnValue(rawWorkOrders$);
    let workOrders$ = service.getAllWorkOrders()
    let workOrders: WorkOrders;
    let expectedWorkOrders: WorkOrders;
    workOrders$.subscribe((resp) => workOrders = resp);
    expectedWorkOrders$.subscribe((resp) => expectedWorkOrders = resp);
    expect(isEqual(workOrders, expectedWorkOrders)).toBeTrue();
  })


  fit('parseJsonData should take string date and convert to a date object', () => {
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
    expectedProgress = [1, 4];
    progress = service.getProgress(operations);

    expect(isEqual(progress, expectedProgress)).toBeTrue();

    operations = [{ STATUS: 'CNF' }, { STATUS: 'CNF' }, { STATUS: 'CNF' }];
    expectedProgress = [3, 3];
    progress = service.getProgress(operations);

    expect(isEqual(progress, expectedProgress)).toBeTrue();


  })

  it('getStatus should return the corresponding status of the workOrder', () => {
    let personDetails = '';
    let rawStatus = 'CRTD'

    status = service.getStatus(personDetails, rawStatus);
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

})