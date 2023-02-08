import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitOfMeasurementDetailViewComponent } from './uom-detail-view.component';

describe('UnitOfMeasurementDetailViewComponent', () => {
  let component: UnitOfMeasurementDetailViewComponent;
  let fixture: ComponentFixture<UnitOfMeasurementDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnitOfMeasurementDetailViewComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitOfMeasurementDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
