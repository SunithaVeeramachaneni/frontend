import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentResponseComponent } from './attachment-response.component';

describe('AttachmentResponseComponent', () => {
  let component: AttachmentResponseComponent;
  let fixture: ComponentFixture<AttachmentResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachmentResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
