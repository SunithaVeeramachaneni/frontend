import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRangeResponseComponent } from './date-range-response.component';

describe('DateRangeResponseComponent', () => {
  let component: DateRangeResponseComponent;
  let fixture: ComponentFixture<DateRangeResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateRangeResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangeResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
