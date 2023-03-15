import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantDetailViewComponent } from './plant-detail-view.component';

describe('PlantDetailViewComponent', () => {
  let component: PlantDetailViewComponent;
  let fixture: ComponentFixture<PlantDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
