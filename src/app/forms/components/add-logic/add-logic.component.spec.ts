import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLogicComponent } from './add-logic.component';

describe('AddLogicComponent', () => {
  let component: AddLogicComponent;
  let fixture: ComponentFixture<AddLogicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLogicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
