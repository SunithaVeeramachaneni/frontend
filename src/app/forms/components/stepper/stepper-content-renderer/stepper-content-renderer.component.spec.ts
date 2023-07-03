import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperContentRendererComponent } from './stepper-content-renderer.component';

describe('StepperContentRendererComponent', () => {
  let component: StepperContentRendererComponent;
  let fixture: ComponentFixture<StepperContentRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepperContentRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperContentRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
