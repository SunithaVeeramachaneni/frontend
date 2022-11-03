import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabularDependencyComponent } from './tabular-dependency.component';

describe('TabularDependencyComponent', () => {
  let component: TabularDependencyComponent;
  let fixture: ComponentFixture<TabularDependencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabularDependencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabularDependencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
