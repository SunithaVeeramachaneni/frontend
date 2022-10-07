import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McqResponseComponent } from './mcq-response.component';

describe('McqResponseComponent', () => {
  let component: McqResponseComponent;
  let fixture: ComponentFixture<McqResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McqResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McqResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
