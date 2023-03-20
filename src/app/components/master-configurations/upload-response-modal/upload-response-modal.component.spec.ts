import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadResponseModalComponent } from './upload-response-modal.component';

describe('UploadResponseModalComponent', () => {
  let component: UploadResponseModalComponent;
  let fixture: ComponentFixture<UploadResponseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadResponseModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadResponseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
