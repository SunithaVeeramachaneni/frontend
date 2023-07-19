import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundPlanFullScreenModalComponent } from './round-plan-full-screen-modal.component';

describe('RoundPlanFullScreenModalComponent', () => {
  let component: RoundPlanFullScreenModalComponent;
  let fixture: ComponentFixture<RoundPlanFullScreenModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundPlanFullScreenModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundPlanFullScreenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
