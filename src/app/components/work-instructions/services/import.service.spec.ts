import { TestBed } from '@angular/core/testing';
import { SseService } from 'src/app/shared/services/sse.service';

import { ImportService } from './import.service';

describe('ImportService', () => {
  let service: ImportService;
  let sseServiceSpy: SseService;

  beforeEach(() => {
    sseServiceSpy = jasmine.createSpyObj('SseService', [
      'getEventSourceWithPost',
      'closeEventSource'
    ]);
    TestBed.configureTestingModule({
      providers: [{ provide: SseService, useValue: sseServiceSpy }]
    });
    service = TestBed.inject(ImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
