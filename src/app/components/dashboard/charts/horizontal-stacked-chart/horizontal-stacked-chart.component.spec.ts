import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalStackedChartComponent } from './horizontal-stacked-chart.component';

describe('HorizontalStackedChartComponent', () => {
  let component: HorizontalStackedChartComponent;
  let fixture: ComponentFixture<HorizontalStackedChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorizontalStackedChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorizontalStackedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
