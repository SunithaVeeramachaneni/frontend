import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftChangeWarningModalComponent } from './shift-change-warning-modal.component';

describe('ShiftChangeWarningModalComponent', () => {
  let component: ShiftChangeWarningModalComponent;
  let fixture: ComponentFixture<ShiftChangeWarningModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftChangeWarningModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftChangeWarningModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
