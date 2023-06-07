import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundsSchedulerComponent } from './rounds-scheduler.component';

describe('RoundsSchedulerComponent', () => {
  let component: RoundsSchedulerComponent;
  let fixture: ComponentFixture<RoundsSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundsSchedulerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundsSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
