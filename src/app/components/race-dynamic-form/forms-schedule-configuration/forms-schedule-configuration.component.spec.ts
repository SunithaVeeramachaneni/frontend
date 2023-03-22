import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsScheduleConfigurationComponent } from './forms-schedule-configuration.component';

describe('RoundsSchedulerConfigurationComponent', () => {
  let component: FormsScheduleConfigurationComponent;
  let fixture: ComponentFixture<FormsScheduleConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormsScheduleConfigurationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsScheduleConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
