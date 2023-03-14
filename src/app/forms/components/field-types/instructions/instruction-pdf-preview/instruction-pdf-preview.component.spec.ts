import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionPdfPreviewComponent } from './instruction-pdf-preview.component';

describe('InstructionPdfPreviewComponent', () => {
  let component: InstructionPdfPreviewComponent;
  let fixture: ComponentFixture<InstructionPdfPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructionPdfPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionPdfPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
