import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskLevelTaskComponentsComponent } from './task-level-task-components.component';

describe('TaskLevelTaskComponentsComponent', () => {
  let component: TaskLevelTaskComponentsComponent;
  let fixture: ComponentFixture<TaskLevelTaskComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskLevelTaskComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskLevelTaskComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
