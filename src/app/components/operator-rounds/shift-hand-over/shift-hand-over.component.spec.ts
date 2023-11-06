import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftHandOverComponent } from './shift-hand-over.component';

describe('ShiftHandOverComponent', () => {
  let component: ShiftHandOverComponent;
  let fixture: ComponentFixture<ShiftHandOverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftHandOverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftHandOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
