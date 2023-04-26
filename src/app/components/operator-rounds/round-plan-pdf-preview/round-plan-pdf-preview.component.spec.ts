import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundPlanPdfPreviewComponent } from './round-plan-pdf-preview.component';

describe('RoundPlanPdfPreviewComponent', () => {
  let component: RoundPlanPdfPreviewComponent;
  let fixture: ComponentFixture<RoundPlanPdfPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundPlanPdfPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundPlanPdfPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
