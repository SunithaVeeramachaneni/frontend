import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationDetailViewComponent } from './location-detail-view.component';

describe('LocationDetailViewComponent', () => {
  let component: LocationDetailViewComponent;
  let fixture: ComponentFixture<LocationDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
