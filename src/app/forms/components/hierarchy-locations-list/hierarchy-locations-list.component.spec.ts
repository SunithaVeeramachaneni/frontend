import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchyLocationsListComponent } from './hierarchy-locations-list.component';

describe('HierarchyLocationsListComponent', () => {
  let component: HierarchyLocationsListComponent;
  let fixture: ComponentFixture<HierarchyLocationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HierarchyLocationsListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyLocationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
