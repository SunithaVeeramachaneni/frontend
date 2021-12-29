import { TestBed } from "@angular/core/testing";
import { SparepartsService } from "./spare-parts.service";
import { AppService } from "../../shared/services/app.services"
import { WorkOrders } from "../../interfaces/work-order";
import { isEqual, isObject } from "lodash";
import * as _ from "lodash";
import { HttpClientModule } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { rawTechniciansSPCC$, expectedTechniciansSPCC, expectedWorkOrdersSPCC, rawWorkOrdersSPCC } from "./spare-parts.mock";




fdescribe('Spare parts service', () => {
  let service: SparepartsService;
  let appServiceSpy: AppService;

  const mockPutData = {
    USNAM: '123' ,
    ASSIGNEE: 'name',
    AUFNR: '9875',
    }

  beforeEach(() => {
      appServiceSpy = jasmine.createSpyObj('AppService', [
      '_getRespFromGateway', '_putDataToGateway'], {}
      );

      (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.spccAbapApiUrl,'pickerlist')
      .and.returnValue(rawTechniciansSPCC$).and.callThrough();

      (appServiceSpy._putDataToGateway as jasmine.Spy)
      .withArgs(environment.spccAbapApiUrl, `workorderspcc/9875`, mockPutData)
      .and.returnValue(true).and.callThrough();

      (appServiceSpy._getRespFromGateway as jasmine.Spy)
      .withArgs(environment.spccAbapApiUrl,'workorderspcc?startdate=2021-11-30T00:00:00&enddate=2021-12-31T23:59:59')
      .and.returnValue(rawWorkOrdersSPCC).and.callThrough();
    


    TestBed.configureTestingModule({
      providers: [SparepartsService,
        { provide: AppService, useValue: appServiceSpy }],
      imports: []
    });
    service = TestBed.inject(SparepartsService);
  });

  it('needs to exist', () => {
    expect(service).toBeTruthy();
  })

  it('getStatus should return the corresponding status of the workOrder', () => {
    let personDetails = '';
    let rawStatus = '1';

    let status = service.getStatus(personDetails, rawStatus);
    expect(isEqual(status, 'Unassigned')).toBeTrue()

    personDetails = '001';
    rawStatus = '2'

    status = service.getStatus(personDetails, rawStatus);
    expect(isEqual(status, 'Assigned for Picking')).toBeTrue()

    personDetails = '001';
    rawStatus = '3'

    status = service.getStatus(personDetails, rawStatus);
    expect(isEqual(status, 'Kitting in Progress')).toBeTrue()

    personDetails = '001';
    rawStatus = '4'

    status = service.getStatus(personDetails, rawStatus);
    expect(isEqual(status, 'Kits Complete')).toBeTrue()

    personDetails = '001';
    rawStatus = '5'

    status = service.getStatus(personDetails, rawStatus);
    expect(isEqual(status, 'Kits Issued')).toBeTrue()

  })

  it('should get and transform the picker list', () => {
    let workOrders$ = service.getPickerList();
    let workOrders;
    workOrders$.subscribe(resp => workOrders = resp);
    expect(isEqual(workOrders, expectedTechniciansSPCC)).toBeTrue();
  })

  it('should succesfully assign a technician', () => {
    let result  = service.assignTechnicianToWorkorder(mockPutData);
    expect(result).toBeTrue()
  })
  
  function difference(object, base) {
    function changes(object, base) {
        return _.transform(object, function(result, value, key) {
            if (!_.isEqual(value, base[key])) {
                result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
            }
        });
    }
    return changes(object, base);
}

it('gets and displays the work orders', () =>{
  let workorders$ = service.getAllWorkOrders({
    "startDate": "2021-11-30T00:00:00",
    "endDate": "2021-12-31T23:59:59"
})
let workorders;
workorders$.subscribe(resp => workorders = resp)
console.log("actual are", JSON.stringify(workorders))
console.log("expected are", JSON.stringify(expectedWorkOrdersSPCC))
expect(isEqual(workorders,expectedWorkOrdersSPCC)).toBeTrue()
})


})



