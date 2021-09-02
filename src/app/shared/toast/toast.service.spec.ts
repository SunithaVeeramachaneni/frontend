import { TestBed } from '@angular/core/testing';
import { Overlay } from '@angular/cdk/overlay';
import { defaultToastConfig, TOAST_CONFIG_TOKEN } from './toast-config';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;
  let overlaySpy: Overlay;

  beforeEach(() => {
    overlaySpy = jasmine.createSpyObj('Overlay', ['create', 'position']);
    TestBed.configureTestingModule({
      providers: [
        ToastService,
        { provide: Overlay, useValue: overlaySpy },
        { provide: TOAST_CONFIG_TOKEN, useValue: defaultToastConfig }
      ]
    });
    service = TestBed.inject(ToastService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
