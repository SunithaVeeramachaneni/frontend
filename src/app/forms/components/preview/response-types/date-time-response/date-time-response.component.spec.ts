import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimeResponseComponent } from './date-time-response.component';

describe('DateTimeResponseComponent', () => {
  let component: DateTimeResponseComponent;
  let fixture: ComponentFixture<DateTimeResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateTimeResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimeResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
