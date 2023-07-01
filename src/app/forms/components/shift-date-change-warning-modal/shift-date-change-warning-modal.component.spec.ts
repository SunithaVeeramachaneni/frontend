import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftDateChangeWarningModalComponent } from './shift-date-change-warning-modal.component';

describe('ShiftDateChangeWarningModalComponent', () => {
  let component: ShiftDateChangeWarningModalComponent;
  let fixture: ComponentFixture<ShiftDateChangeWarningModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftDateChangeWarningModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftDateChangeWarningModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
