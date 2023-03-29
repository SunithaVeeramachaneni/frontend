import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleConfigurationComponent } from './schedule-configuration.component';

describe('RoundsSchedulerConfigurationComponent', () => {
  let component: ScheduleConfigurationComponent;
  let fixture: ComponentFixture<ScheduleConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleConfigurationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
