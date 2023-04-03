import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagePreviewModalComponent } from './image-preview-modal.component';

describe('AssetsModalComponent', () => {
  let component: ImagePreviewModalComponent;
  let fixture: ComponentFixture<ImagePreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImagePreviewModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagePreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
