import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibleInputResponseComponent } from './visible-input-response.component';

describe('VisibleInputResponseComponent', () => {
  let component: VisibleInputResponseComponent;
  let fixture: ComponentFixture<VisibleInputResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisibleInputResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibleInputResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
