import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskLevelMidPanelPagesComponent } from './task-level-mid-panel-pages.component';

describe('TaskLevelMidPanelPagesComponent', () => {
  let component: TaskLevelMidPanelPagesComponent;
  let fixture: ComponentFixture<TaskLevelMidPanelPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskLevelMidPanelPagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskLevelMidPanelPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
