import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleSuccessModalComponent } from './schedule-success-modal.component';

describe('ScheduleSuccessModalComponent', () => {
  let component: ScheduleSuccessModalComponent;
  let fixture: ComponentFixture<ScheduleSuccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleSuccessModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
