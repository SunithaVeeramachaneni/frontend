import { TestBed } from '@angular/core/testing';
import { ToastService } from '../shared/toast';
import { InstructionService } from '../views/home/categories/workinstructions/instruction.service';

import { HttpErrorInterceptor } from './http-error.interceptor';

describe('HttpErrorInterceptor', () => {
  let toasterServiceSpy: ToastService;
  let instructionServiceSpy: InstructionService;
  toasterServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
  instructionServiceSpy = jasmine.createSpyObj('InstructionService', ['handleError']);

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpErrorInterceptor,
      { provide: ToastService, useValue: toasterServiceSpy },
      { provide: InstructionService, useValue: instructionServiceSpy }
    ]
  }));

  it('should be created', () => {
    const interceptor: HttpErrorInterceptor = TestBed.inject(HttpErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
