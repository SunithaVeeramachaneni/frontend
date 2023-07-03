import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperHeaderContainerComponent } from './stepper-header-container.component';

describe('StepperHeaderContainerComponent', () => {
  let component: StepperHeaderContainerComponent;
  let fixture: ComponentFixture<StepperHeaderContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepperHeaderContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperHeaderContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
