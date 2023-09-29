import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisAttachmentResponseComponent } from './analysis-attachment-response.component';

describe('AnalysisAttachmentResponseComponent', () => {
  let component: AnalysisAttachmentResponseComponent;
  let fixture: ComponentFixture<AnalysisAttachmentResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisAttachmentResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisAttachmentResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
