import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundPlanImagePreviewComponent } from './round-plan-image-preview.component';

describe('RoundPlanImagePreviewComponent', () => {
  let component: RoundPlanImagePreviewComponent;
  let fixture: ComponentFixture<RoundPlanImagePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundPlanImagePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundPlanImagePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
