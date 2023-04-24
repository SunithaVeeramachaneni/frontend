import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PDFPreviewComponent } from './pdf-preview.component';

describe('PDFPreviewComponent', () => {
  let component: PDFPreviewComponent;
  let fixture: ComponentFixture<PDFPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PDFPreviewComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PDFPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
