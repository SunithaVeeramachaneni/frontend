import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskLevelMidPanelSectionComponent } from './task-level-mid-panel-section.component';

describe('TaskLevelMidPanelSectionComponent', () => {
  let component: TaskLevelMidPanelSectionComponent;
  let fixture: ComponentFixture<TaskLevelMidPanelSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskLevelMidPanelSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskLevelMidPanelSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
