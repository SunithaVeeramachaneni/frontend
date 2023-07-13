import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupDeleteModalComponent } from './user-group-delete-modal.component';

describe('UserGroupDeleteModalComponent', () => {
  let component: UserGroupDeleteModalComponent;
  let fixture: ComponentFixture<UserGroupDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGroupDeleteModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGroupDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
