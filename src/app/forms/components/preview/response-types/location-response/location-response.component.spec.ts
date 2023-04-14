import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationResponseComponent } from './location-response.component';

describe('LocationResponseComponent', () => {
  let component: LocationResponseComponent;
  let fixture: ComponentFixture<LocationResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
