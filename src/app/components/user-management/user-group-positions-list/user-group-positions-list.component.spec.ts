import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupPositionsListComponent } from './user-group-positions-list.component';

describe('UserGroupPositionsListComponent', () => {
  let component: UserGroupPositionsListComponent;
  let fixture: ComponentFixture<UserGroupPositionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGroupPositionsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGroupPositionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
