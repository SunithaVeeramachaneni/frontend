import { TestBed } from '@angular/core/testing';
import { AppService } from 'src/app/shared/services/app.services';

import { ReportConfigurationService } from './report-configuration.service';

describe('ReportConfigurationService', () => {
  let service: ReportConfigurationService;
  let appServiceSpy: AppService;

  beforeEach(() => {
    appServiceSpy = jasmine.createSpyObj('AppService', [
      '_getRespById',
      '_postData',
      'downloadFile',
      'patchData'
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: AppService, useValue: appServiceSpy }]
    });
    service = TestBed.inject(ReportConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
