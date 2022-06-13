import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModules } from 'src/app/material.module';
import {
  DeleteReportData,
  ReportDeleteModalComponent
} from './report-delete-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { reportWidgets } from './report-delete-modal.component.mock';
import { reports } from '../reports/reports.component.mock';

describe('ReportDeleteModalComponent', () => {
  let component: ReportDeleteModalComponent;
  let fixture: ComponentFixture<ReportDeleteModalComponent>;
  let dialogRefSpy: MatDialogRef<ReportDeleteModalComponent>;
  let deleteReportData: DeleteReportData;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    deleteReportData = {
      reportID: reports.data[0].id,
      reportName: reports.data[0].name,
      groupedWidgets: reportWidgets
    };

    await TestBed.configureTestingModule({
      declarations: [ReportDeleteModalComponent],
      imports: [AppMaterialModules],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: deleteReportData
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
