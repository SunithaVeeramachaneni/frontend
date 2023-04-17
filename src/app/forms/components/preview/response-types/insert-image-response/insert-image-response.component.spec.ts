import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertImageResponseComponent } from './insert-image-response.component';

describe('InsertImageResponseComponent', () => {
  let component: InsertImageResponseComponent;
  let fixture: ComponentFixture<InsertImageResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertImageResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertImageResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
