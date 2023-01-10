import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionSliderComponent } from './submission-slider.component';

describe('SubmissionSliderComponent', () => {
  let component: SubmissionSliderComponent;
  let fixture: ComponentFixture<SubmissionSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmissionSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
