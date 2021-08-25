import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertComponent, AlertConfig, AlertModule } from 'ngx-bootstrap/alert';
import { AlertService } from './alert.service';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let router: Router;
  let alertServiceSpy: AlertService;
  let alertDe: DebugElement;
  let alertEl: HTMLElement;

  beforeEach(async(() => {
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['onAlert', 'clear']);

    TestBed.configureTestingModule({
      declarations: [AlertComponent],
      imports: [RouterTestingModule, AlertModule],
      providers: [
        AlertConfig,
        { provide: AlertService, useValue: alertServiceSpy }
      ]
    }).compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    alertDe = fixture.debugElement;
    alertEl = alertDe.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
