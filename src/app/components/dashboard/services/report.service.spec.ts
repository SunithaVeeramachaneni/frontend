import { TestBed } from '@angular/core/testing';
import { AppService } from '../../../shared/services/app.services';

import { ReportService } from './report.service';

describe('ReportService', () => {
  let service: ReportService;
  let appServiceSpy: AppService;

  beforeEach(() => {
    appServiceSpy = jasmine.createSpyObj('AppService', [
      '_getResp',
      '_removeData',
      'patchData'
    ]);
    TestBed.configureTestingModule({
      providers: [{ provide: AppService, useValue: appServiceSpy }]
    });
    service = TestBed.inject(ReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
