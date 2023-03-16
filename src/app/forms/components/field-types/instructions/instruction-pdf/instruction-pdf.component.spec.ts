import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionPdfComponent } from './instruction-pdf.component';

describe('InstructionPdfComponent', () => {
  let component: InstructionPdfComponent;
  let fixture: ComponentFixture<InstructionPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructionPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
