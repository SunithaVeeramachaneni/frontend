import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoundPlanListComponent } from './round-plan-list.component';

describe('RoundPlanListComponent', () => {
  let component: RoundPlanListComponent;
  let fixture: ComponentFixture<RoundPlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoundPlanListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
