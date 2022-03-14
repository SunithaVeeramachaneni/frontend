import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportConfigurationListModalComponent } from './report-configuration-list-modal.component';
import { ReportService } from '../services/report.service';
import { AppMaterialModules } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { categories$ } from './report-configuration-list-modal.component.mock';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';

describe('ReportConfigurationListModalComponent', () => {
  let component: ReportConfigurationListModalComponent;
  let fixture: ComponentFixture<ReportConfigurationListModalComponent>;
  let reportServiceSpy: ReportService;

  beforeEach(async () => {
    reportServiceSpy = jasmine.createSpyObj('ReportService', [
      'getReportCategories$',
      'updateReportDefinitionName'
    ]);

    await TestBed.configureTestingModule({
      declarations: [ReportConfigurationListModalComponent],
      imports: [
        AppMaterialModules,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgxShimmerLoadingModule
      ],
      providers: [{ provide: ReportService, useValue: reportServiceSpy }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportConfigurationListModalComponent);
    component = fixture.componentInstance;
    (reportServiceSpy.getReportCategories$ as jasmine.Spy)
      .withArgs()
      .and.returnValue(categories$);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
