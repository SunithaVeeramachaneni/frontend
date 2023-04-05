import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoundPlanConfigurationModalComponent } from './round-plan-configuration-modal.component';

describe('RoundPlanConfigurationModalComponent', () => {
  let component: RoundPlanConfigurationModalComponent;
  let fixture: ComponentFixture<RoundPlanConfigurationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoundPlanConfigurationModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundPlanConfigurationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
