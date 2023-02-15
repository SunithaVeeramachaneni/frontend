import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchyModalComponent } from './hierarchy-modal.component';

describe('HierarchyModalComponent', () => {
  let component: HierarchyModalComponent;
  let fixture: ComponentFixture<HierarchyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HierarchyModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
