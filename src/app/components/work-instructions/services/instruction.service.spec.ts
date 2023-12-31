import { TestBed } from "@angular/core/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { AppService } from '../../../shared/services/app.services';
import { State } from "../../../state/app.state";
import { InstructionService } from "./instruction.service";

describe("InstructionService", () => {
  let service: InstructionService;
  let appServiceSpy: AppService;
  let store: MockStore<State>;

  beforeEach(() => {
    appServiceSpy = jasmine.createSpyObj('AppService', [
      '_getResp',
      '_getRespFromGateway',
      '_getRespById',
      '_getRespByName',
      '_postData',
      '_updateData',
      '_removeData',
      '_getDataFromGatewayById',
      'setApiUrl',
      'setAbapApiUrl'
    ]);

    TestBed.configureTestingModule({
      providers: [
        InstructionService,
        { provide: AppService, useValue: appServiceSpy },
        provideMockStore()
      ]
    });
    store = TestBed.inject(MockStore);
    service = TestBed.inject(InstructionService);
  });

  it("should create", () => {
    expect(service).toBeTruthy();
  });
});
