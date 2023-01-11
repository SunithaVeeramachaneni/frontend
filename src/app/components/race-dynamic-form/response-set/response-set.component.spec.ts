import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseSetComponent } from './response-set.component';

describe('ResponseSetComponent', () => {
  let component: ResponseSetComponent;
  let fixture: ComponentFixture<ResponseSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseSetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
