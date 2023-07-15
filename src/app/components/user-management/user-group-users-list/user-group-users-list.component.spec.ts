import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupUsersListComponent } from './user-group-users-list.component';

describe('UserGroupUsersListComponent', () => {
  let component: UserGroupUsersListComponent;
  let fixture: ComponentFixture<UserGroupUsersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGroupUsersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGroupUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
