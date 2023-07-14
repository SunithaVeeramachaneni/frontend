import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfBuilderOprComponent } from './pdf-builder-opr.component';

describe('PdfBuilderOprComponent', () => {
  let component: PdfBuilderOprComponent;
  let fixture: ComponentFixture<PdfBuilderOprComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfBuilderOprComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfBuilderOprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
