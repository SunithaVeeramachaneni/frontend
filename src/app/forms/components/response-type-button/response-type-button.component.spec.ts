import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseTypeButtonComponent } from './response-type-button.component';

describe('ResponseTypeButtonComponent', () => {
  let component: ResponseTypeButtonComponent;
  let fixture: ComponentFixture<ResponseTypeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseTypeButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseTypeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
