import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUserGroupPositionsModalComponent } from './select-user-group-positions-modal.component';

describe('SelectUserGroupPositionsModalComponent', () => {
  let component: SelectUserGroupPositionsModalComponent;
  let fixture: ComponentFixture<SelectUserGroupPositionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectUserGroupPositionsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectUserGroupPositionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
