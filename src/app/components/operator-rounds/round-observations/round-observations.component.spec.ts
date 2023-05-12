import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundObservationsComponent } from './round-observations.component';

describe('RoundObservationsComponent', () => {
  let component: RoundObservationsComponent;
  let fixture: ComponentFixture<RoundObservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoundObservationsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundObservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
