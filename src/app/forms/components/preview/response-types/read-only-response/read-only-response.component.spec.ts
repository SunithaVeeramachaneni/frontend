import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadOnlyResponseComponent } from './read-only-response.component';

describe('ReadOnlyResponseComponent', () => {
  let component: ReadOnlyResponseComponent;
  let fixture: ComponentFixture<ReadOnlyResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadOnlyResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadOnlyResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
