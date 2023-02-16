import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitOfMeasurementDeleteModalComponent } from './uom-delete-modal.component';

describe('UnitOfMeasurementDeleteModalComponent', () => {
  let component: UnitOfMeasurementDeleteModalComponent;
  let fixture: ComponentFixture<UnitOfMeasurementDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnitOfMeasurementDeleteModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitOfMeasurementDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
