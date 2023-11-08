import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftHandOverModalComponent } from './shift-hand-over-modal.component';

describe('ShiftHandOverModalComponent', () => {
  let component: ShiftHandOverModalComponent;
  let fixture: ComponentFixture<ShiftHandOverModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShiftHandOverModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftHandOverModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
