import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadImagePreviewComponent } from './upload-image-preview.component';

describe('RoundPlanImagePreviewComponent', () => {
  let component: UploadImagePreviewComponent;
  let fixture: ComponentFixture<UploadImagePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadImagePreviewComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadImagePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
