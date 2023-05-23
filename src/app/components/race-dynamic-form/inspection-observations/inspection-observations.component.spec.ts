import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionObservationsComponent } from './inspection-observations.component';

describe('InspectionObservationsComponent', () => {
  let component: InspectionObservationsComponent;
  let fixture: ComponentFixture<InspectionObservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InspectionObservationsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionObservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
