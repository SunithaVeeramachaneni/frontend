import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModules } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CreateUpdateDashboardDialogComponent,
  DashboardCreateUpdateDialogData
} from './dashboard-create-update-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { dashboards } from '../dashboards/dashboards.component.mock';

describe('CreateUpdateDashboardDialogComponent', () => {
  let component: CreateUpdateDashboardDialogComponent;
  let fixture: ComponentFixture<CreateUpdateDashboardDialogComponent>;
  let dialogRefSpy: MatDialogRef<CreateUpdateDashboardDialogComponent>;
  let dashboardCreateUpdateDialogData: DashboardCreateUpdateDialogData;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dashboardCreateUpdateDialogData = {
      dialogMode: 'CREATE',
      data: dashboards[0]
    };

    await TestBed.configureTestingModule({
      declarations: [CreateUpdateDashboardDialogComponent],
      imports: [AppMaterialModules, FormsModule, BrowserAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
