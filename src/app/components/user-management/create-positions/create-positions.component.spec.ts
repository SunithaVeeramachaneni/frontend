import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePositionsComponent } from './create-positions.component';

describe('CreatePositionsComponent', () => {
  let component: CreatePositionsComponent;
  let fixture: ComponentFixture<CreatePositionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePositionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
