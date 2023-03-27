import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRoundComponent } from './assign-round.component';

describe('AssignRoundComponent', () => {
  let component: AssignRoundComponent;
  let fixture: ComponentFixture<AssignRoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignRoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
