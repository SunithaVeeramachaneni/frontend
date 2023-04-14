import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PDFBuilderComponent } from './pdf-builder.component';

describe('PDFBuilderComponent', () => {
  let component: PDFBuilderComponent;
  let fixture: ComponentFixture<PDFBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PDFBuilderComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PDFBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
