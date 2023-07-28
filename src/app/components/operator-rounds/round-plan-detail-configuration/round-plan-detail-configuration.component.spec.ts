import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundPlanDetailConfigurationComponent } from './round-plan-detail-configuration.component';

describe('RoundPlanDetailConfigurationComponent', () => {
  let component: RoundPlanDetailConfigurationComponent;
  let fixture: ComponentFixture<RoundPlanDetailConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoundPlanDetailConfigurationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundPlanDetailConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
