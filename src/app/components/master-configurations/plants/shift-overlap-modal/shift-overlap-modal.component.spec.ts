import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftOverlapModalComponent } from './shift-overlap-modal.component';

describe('ShiftOverlapModalComponent', () => {
  let component: ShiftOverlapModalComponent;
  let fixture: ComponentFixture<ShiftOverlapModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftOverlapModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftOverlapModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
