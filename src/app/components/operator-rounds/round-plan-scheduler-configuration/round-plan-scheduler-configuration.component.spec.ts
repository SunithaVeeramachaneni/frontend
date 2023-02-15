import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundPlanSchedulerConfigurationComponent } from './round-plan-scheduler-configuration.component';

describe('RoundsSchedulerConfigurationComponent', () => {
  let component: RoundPlanSchedulerConfigurationComponent;
  let fixture: ComponentFixture<RoundPlanSchedulerConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoundPlanSchedulerConfigurationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundPlanSchedulerConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
