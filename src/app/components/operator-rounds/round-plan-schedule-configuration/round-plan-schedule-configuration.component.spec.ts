import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundPlanScheduleConfigurationComponent } from './round-plan-schedule-configuration.component';

describe('RoundsSchedulerConfigurationComponent', () => {
  let component: RoundPlanScheduleConfigurationComponent;
  let fixture: ComponentFixture<RoundPlanScheduleConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoundPlanScheduleConfigurationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundPlanScheduleConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
