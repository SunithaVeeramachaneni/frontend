import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundPlanConfigurationComponent } from './round-plan-configuration.component';

describe('RoundPlanConfigurationComponent', () => {
  let component: RoundPlanConfigurationComponent;
  let fixture: ComponentFixture<RoundPlanConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoundPlanConfigurationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundPlanConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
