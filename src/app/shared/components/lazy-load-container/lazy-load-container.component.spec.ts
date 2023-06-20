import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LazyLoadContainerComponent } from './lazy-load-container.component';

describe('LazyLoadContainerComponent', () => {
  let component: LazyLoadContainerComponent;
  let fixture: ComponentFixture<LazyLoadContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LazyLoadContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LazyLoadContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
