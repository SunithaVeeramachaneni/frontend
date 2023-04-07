import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTasksSliderComponent } from './import-tasks-slider.component';

describe('ImportTasksSliderComponent', () => {
  let component: ImportTasksSliderComponent;
  let fixture: ComponentFixture<ImportTasksSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportTasksSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTasksSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
