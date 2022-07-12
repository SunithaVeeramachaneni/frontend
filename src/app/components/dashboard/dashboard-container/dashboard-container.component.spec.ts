import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { AppMaterialModules } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbService } from 'xng-breadcrumb';
import { DashboardsComponent } from '../dashboards/dashboards.component';
import { dashboards$ } from '../dashboards/dashboards.component.mock';
import { DashboardService } from '../services/dashboard.service';

import { DashboardContainerComponent } from './dashboard-container.component';

describe('DashboardContainerComponent', () => {
  let component: DashboardContainerComponent;
  let fixture: ComponentFixture<DashboardContainerComponent>;
  let dashboardServiceSpy: DashboardService;
  let breadcrumbService: BreadcrumbService;

  beforeEach(async () => {
    dashboardServiceSpy = jasmine.createSpyObj('DashboardService', [], {
      dashboardsAction$: dashboards$
    });

    await TestBed.configureTestingModule({
      declarations: [
        DashboardContainerComponent,
        MockComponent(DashboardsComponent)
      ],
      imports: [
        SharedModule,
        AppMaterialModules,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [{ provide: DashboardService, useValue: dashboardServiceSpy }]
    }).compileComponents();
  });

  beforeEach(() => {
    breadcrumbService = TestBed.inject(BreadcrumbService);
    fixture = TestBed.createComponent(DashboardContainerComponent);
    component = fixture.componentInstance;
    spyOn(breadcrumbService, 'set');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
