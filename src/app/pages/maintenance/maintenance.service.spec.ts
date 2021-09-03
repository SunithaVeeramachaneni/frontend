import { TestBed } from "@angular/core/testing";
import { rawWorkOrders$, expectedWorkOrders$ } from "./maintenance.mocks"
import { MaintenanceService } from "./maintenance.service";
import { AppService } from "../../shared/services/app.services"
import { WorkOrders } from "../../interfaces/work-order";
import { isEqual, isObject } from "lodash";
import * as _ from "lodash";
import { HttpClientModule } from "@angular/common/http";

describe('Maintenance service', () => {
  let service: MaintenanceService;
  let appService: AppService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MaintenanceService, AppService],
      imports: [HttpClientModule]
    });
    service = TestBed.inject(MaintenanceService);
    appService = TestBed.inject(AppService);
  });

  it('needs to exist', () => {
    expect(service).toBeTruthy();
  })

  it('needs to process raw data and return Work Orders', () => {

    spyOn(appService, '_getRespFromGateway').and.returnValue(rawWorkOrders$);
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