import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HierarchyContainerComponent } from './hierarchy-container.component';

describe('HierarchyContainerComponent', () => {
  let component: HierarchyContainerComponent;
  let fixture: ComponentFixture<HierarchyContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HierarchyContainerComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
