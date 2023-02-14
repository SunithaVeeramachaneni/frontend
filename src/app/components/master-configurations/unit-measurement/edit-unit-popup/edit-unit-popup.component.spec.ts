import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUnitPopupComponent } from './edit-unit-popup.component';

describe('EditUnitPopupComponent', () => {
  let component: EditUnitPopupComponent;
  let fixture: ComponentFixture<EditUnitPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUnitPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUnitPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
