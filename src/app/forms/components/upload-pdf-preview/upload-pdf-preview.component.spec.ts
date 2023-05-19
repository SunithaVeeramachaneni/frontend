import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPdfPreviewComponent } from './upload-pdf-preview.component';

describe('UploadPdfPreviewComponent', () => {
  let component: UploadPdfPreviewComponent;
  let fixture: ComponentFixture<UploadPdfPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadPdfPreviewComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPdfPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
