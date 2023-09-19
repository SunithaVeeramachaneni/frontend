import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskLevelSchedulerComponent } from './task-level-scheduler.component';

describe('TaskLevelSchedulerComponent', () => {
  let component: TaskLevelSchedulerComponent;
  let fixture: ComponentFixture<TaskLevelSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskLevelSchedulerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskLevelSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
