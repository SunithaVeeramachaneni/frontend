import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchyAssetsListComponent } from './hierarchy-assets-list.component';

describe('HierarchyAssetsListComponent', () => {
  let component: HierarchyAssetsListComponent;
  let fixture: ComponentFixture<HierarchyAssetsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HierarchyAssetsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyAssetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
