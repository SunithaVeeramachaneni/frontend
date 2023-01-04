import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseTypeSideDrawerComponent } from './response-type-side-drawer.component';

describe('ResponseTypeSideDrawerComponent', () => {
  let component: ResponseTypeSideDrawerComponent;
  let fixture: ComponentFixture<ResponseTypeSideDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseTypeSideDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseTypeSideDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
