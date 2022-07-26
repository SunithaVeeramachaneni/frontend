import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModules } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CreateUpdateDashboardDialogComponent,
  DashboardCreateUpdateDialogData
} from './dashboard-create-update-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { dashboards } from '../dashboards/dashboards.component.mock';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { DashboardService } from '../services/dashboard.service';

describe('CreateUpdateDashboardDialogComponent', () => {
  let component: CreateUpdateDashboardDialogComponent;
  let fixture: ComponentFixture<CreateUpdateDashboardDialogComponent>;
  let dialogRefSpy: MatDialogRef<CreateUpdateDashboardDialogComponent>;
  let dashboardCreateUpdateDialogData: DashboardCreateUpdateDialogData;
  let dashboardServiceSpy: DashboardService;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dashboardServiceSpy = jasmine.createSpyObj('DashboardService', [
      'getDashboards'
    ]);
    dashboardCreateUpdateDialogData = {
      dialogMode: 'CREATE',
      data: dashboards[0]
    };

    await TestBed.configureTestingModule({
      declarations: [CreateUpdateDashboardDialogComponent],
      imports: [
        AppMaterialModules,
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: DashboardService, useValue: dashboardServiceSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: dashboardCreateUpdateDialogData
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateDashboardDialogComponent);
    component = fixture.componentInstance;
    (dashboardServiceSpy.getDashboards as jasmine.Spy)
      .withArgs()
      .and.returnValue(dashboards);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
