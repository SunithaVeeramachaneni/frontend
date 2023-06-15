import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUserGroupModalComponent } from './add-edit-user-group-modal.component';

describe('AddEditUserGroupModalComponent', () => {
  let component: AddEditUserGroupModalComponent;
  let fixture: ComponentFixture<AddEditUserGroupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditUserGroupModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditUserGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
