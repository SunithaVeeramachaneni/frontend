import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftLogListComponent } from './shift-log-list.component';

describe('ShiftLogListComponent', () => {
  let component: ShiftLogListComponent;
  let fixture: ComponentFixture<ShiftLogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftLogListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
