import { TestBed } from '@angular/core/testing';
import { AppService } from 'src/app/shared/services/app.services';

import { RolesPermissionsService } from './roles-permissions.service';

describe('DashboardService', () => {
  let service: RolesPermissionsService;
  let appServiceSpy: AppService;

  beforeEach(() => {
    appServiceSpy = jasmine.createSpyObj('AppService', [
      '_getResp',
      '_postData',
      'patchData',
      '_removeData'
    ]);
    TestBed.configureTestingModule({
      providers: [{ provide: AppService, useValue: appServiceSpy }]
    });
    service = TestBed.inject(RolesPermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
