import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviseScheduleComponent } from './revise-schedule.component';

describe('ReviseScheduleComponent', () => {
  let component: ReviseScheduleComponent;
  let fixture: ComponentFixture<ReviseScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviseScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviseScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
