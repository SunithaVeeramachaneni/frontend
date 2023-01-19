import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalResponseTypeSideDrawerComponent } from './global-response-type-side-drawer.component';

describe('GlobalResponseTypeSideDrawerComponent', () => {
  let component: GlobalResponseTypeSideDrawerComponent;
  let fixture: ComponentFixture<GlobalResponseTypeSideDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalResponseTypeSideDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalResponseTypeSideDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
