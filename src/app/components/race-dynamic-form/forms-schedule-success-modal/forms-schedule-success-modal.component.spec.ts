import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsScheduleSuccessModalComponent } from './forms-schedule-success-modal.component';

describe('RoundPlanScheduleSuccessModalComponent', () => {
  let component: FormsScheduleSuccessModalComponent;
  let fixture: ComponentFixture<FormsScheduleSuccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormsScheduleSuccessModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsScheduleSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
