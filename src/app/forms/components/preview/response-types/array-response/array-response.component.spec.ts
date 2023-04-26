import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrayResponseComponent } from './array-response.component';

describe('ArrayResponseComponent', () => {
  let component: ArrayResponseComponent;
  let fixture: ComponentFixture<ArrayResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrayResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrayResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
