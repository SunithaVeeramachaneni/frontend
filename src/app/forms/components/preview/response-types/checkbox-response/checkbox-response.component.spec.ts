import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxResponseComponent } from './checkbox-response.component';

describe('CheckboxResponseComponent', () => {
  let component: CheckboxResponseComponent;
  let fixture: ComponentFixture<CheckboxResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckboxResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
