import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUserUsergroupModalComponent } from './select-user-usergroup-modal.component';

describe('SelectUserUsergroupModalComponent', () => {
  let component: SelectUserUsergroupModalComponent;
  let fixture: ComponentFixture<SelectUserUsergroupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectUserUsergroupModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectUserUsergroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
