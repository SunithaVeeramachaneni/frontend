import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftMenuItemComponent } from './shift-menu-item.component';

describe('ShiftComponent', () => {
  let component: ShiftMenuItemComponent;
  let fixture: ComponentFixture<ShiftMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShiftMenuItemComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
