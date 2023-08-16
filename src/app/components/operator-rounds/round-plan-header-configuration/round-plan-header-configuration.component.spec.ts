import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoundPlanHeaderConfigurationComponent } from './round-plan-header-configuration.component';

describe('RoundPlanHeaderConfigurationComponent', () => {
  let component: RoundPlanHeaderConfigurationComponent;
  let fixture: ComponentFixture<RoundPlanHeaderConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoundPlanHeaderConfigurationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundPlanHeaderConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
