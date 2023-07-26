import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDetailConfigurationComponent } from './form-detail-configuration.component';

describe('FormDetailConfigurationComponent', () => {
  let component: FormDetailConfigurationComponent;
  let fixture: ComponentFixture<FormDetailConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormDetailConfigurationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDetailConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
