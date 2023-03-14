import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundPlanScheduleSuccessModalComponent } from './round-plan-schedule-success-modal.component';

describe('RoundPlanScheduleSuccessModalComponent', () => {
  let component: RoundPlanScheduleSuccessModalComponent;
  let fixture: ComponentFixture<RoundPlanScheduleSuccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundPlanScheduleSuccessModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundPlanScheduleSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
