import { TestBed } from '@angular/core/testing';
import { AppService } from 'src/app/shared/services/app.services';

import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let appServiceSpy: AppService;

  beforeEach(() => {
    appServiceSpy = jasmine.createSpyObj('AppService', [
      '_postData',
      '_getResp'
    ]);
    TestBed.configureTestingModule({
      providers: [{ provide: AppService, useValue: appServiceSpy }]
    });
    service = TestBed.inject(DashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
