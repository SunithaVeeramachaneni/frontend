import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormHeaderConfigurationComponent } from './form-header-configuration.component';

describe('FormHeaderConfigurationComponent', () => {
  let component: FormHeaderConfigurationComponent;
  let fixture: ComponentFixture<FormHeaderConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormHeaderConfigurationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormHeaderConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
