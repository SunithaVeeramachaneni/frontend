import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskLeveMidPanelQuestionComponentsComponent } from './task-leve-mid-panel-question-components.component';

describe('TaskLeveMidPanelQuestionComponentsComponent', () => {
  let component: TaskLeveMidPanelQuestionComponentsComponent;
  let fixture: ComponentFixture<TaskLeveMidPanelQuestionComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskLeveMidPanelQuestionComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskLeveMidPanelQuestionComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
