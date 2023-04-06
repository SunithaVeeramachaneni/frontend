import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderResponseComponent } from './slider-response.component';

describe('SliderResponseComponent', () => {
  let component: SliderResponseComponent;
  let fixture: ComponentFixture<SliderResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
