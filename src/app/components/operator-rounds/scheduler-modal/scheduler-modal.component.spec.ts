import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerModalComponent } from './scheduler-modal.component';

describe('SchedulerModalComponent', () => {
  let component: SchedulerModalComponent;
  let fixture: ComponentFixture<SchedulerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedulerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
