import { DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModules } from '../../material.module';
import {
  defaultToastConfig,
  ToastData,
  TOAST_CONFIG_TOKEN,
} from './toast-config';
import { ToastRef } from './toast-ref';
import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastRefSpy: ToastRef;
  let toastDataSpy: ToastData;
  let toastDe: DebugElement;
  let toastEl: HTMLElement;

  beforeEach(waitForAsync(() => {
    toastRefSpy = jasmine.createSpyObj('ToastRef', ['close']);
    toastDataSpy = jasmine.createSpyObj('ToastData', [], {
      type: 'success',
      text: 'Toast Message',
    });

    TestBed.configureTestingModule({
      declarations: [ToastComponent],
      imports: [BrowserAnimationsModule, AppMaterialModules],
      providers: [
        { provide: ToastData, useValue: toastDataSpy },
        { provide: ToastRef, useValue: toastRefSpy },
        { provide: TOAST_CONFIG_TOKEN, useValue: defaultToastConfig },
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    toastDe = fixture.debugElement;
    toastEl = toastDe.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
