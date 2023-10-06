import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnConfigurationSliderComponent } from './column-configuration-slider.component';

describe('ColumnConfigurationSliderComponent', () => {
  let component: ColumnConfigurationSliderComponent;
  let fixture: ComponentFixture<ColumnConfigurationSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnConfigurationSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnConfigurationSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
