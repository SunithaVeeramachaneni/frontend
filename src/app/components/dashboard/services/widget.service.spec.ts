import { TestBed } from '@angular/core/testing';
import { AppService } from 'src/app/shared/services/app.services';

import { WidgetService } from './widget.service';

describe('WidgetService', () => {
  let service: WidgetService;
  let appServiceSpy: AppService;

  beforeEach(() => {
    appServiceSpy = jasmine.createSpyObj('AppService', [
      '_postData',
      '_getResp',
      'patchData'
    ]);
    TestBed.configureTestingModule({
      providers: [{ provide: AppService, useValue: appServiceSpy }]
    });
    service = TestBed.inject(WidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
