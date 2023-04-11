import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDataSliderComponent } from './master-data-slider.component';

describe('MasterDataSliderComponent', () => {
  let component: MasterDataSliderComponent;
  let fixture: ComponentFixture<MasterDataSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDataSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDataSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
