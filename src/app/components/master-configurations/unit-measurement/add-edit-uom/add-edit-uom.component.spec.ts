import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUnitOfMeasurementComponent } from './add-edit-uom.component';

describe('AddEditUnitOfMeasurementComponent', () => {
  let component: AddEditUnitOfMeasurementComponent;
  let fixture: ComponentFixture<AddEditUnitOfMeasurementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditUnitOfMeasurementComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditUnitOfMeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
