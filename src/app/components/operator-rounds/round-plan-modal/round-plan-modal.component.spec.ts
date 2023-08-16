import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundPlanModalComponent } from './round-plan-modal.component';

describe('RoundPlanModalComponent', () => {
  let component: RoundPlanModalComponent;
  let fixture: ComponentFixture<RoundPlanModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoundPlanModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
