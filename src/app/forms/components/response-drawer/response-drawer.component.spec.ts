import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseDrawerComponent } from './response.drawer.component';

describe('ResponseTypeComponent', () => {
  let component: ResponseDrawerComponent;
  let fixture: ComponentFixture<ResponseDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponseDrawerComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
