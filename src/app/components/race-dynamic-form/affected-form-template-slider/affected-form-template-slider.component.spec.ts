import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectedFormTemplateSliderComponent } from './affected-form-template-slider.component';

describe('AffectedFormTemplateSliderComponent', () => {
  let component: AffectedFormTemplateSliderComponent;
  let fixture: ComponentFixture<AffectedFormTemplateSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffectedFormTemplateSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectedFormTemplateSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
