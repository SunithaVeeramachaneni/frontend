import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowHierarchyPopupComponent } from './show-hierarchy-popup.component';

describe('ShowHierarchyPopupComponent', () => {
  let component: ShowHierarchyPopupComponent;
  let fixture: ComponentFixture<ShowHierarchyPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowHierarchyPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowHierarchyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
