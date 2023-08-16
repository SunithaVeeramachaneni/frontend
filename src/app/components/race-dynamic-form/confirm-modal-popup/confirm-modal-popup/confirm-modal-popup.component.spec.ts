import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmModalPopupComponent } from './confirm-modal-popup.component';

describe('ConfirmModalPopupComponent', () => {
  let component: ConfirmModalPopupComponent;
  let fixture: ComponentFixture<ConfirmModalPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmModalPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
