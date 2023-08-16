import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftChartComponent } from './shift-chart.component';

describe('ShiftChartComponent', () => {
  let component: ShiftChartComponent;
  let fixture: ComponentFixture<ShiftChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShiftChartComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
