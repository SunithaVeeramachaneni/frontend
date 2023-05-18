import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedToComponent } from './assigned-to.component';

describe('AssignedToComponent', () => {
  let component: AssignedToComponent;
  let fixture: ComponentFixture<AssignedToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedToComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
