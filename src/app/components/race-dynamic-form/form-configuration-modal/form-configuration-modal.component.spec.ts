import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConfigurationModalComponent } from './form-configuration-modal.component';

describe('FormConfigurationModalComponent', () => {
  let component: FormConfigurationModalComponent;
  let fixture: ComponentFixture<FormConfigurationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormConfigurationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormConfigurationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
