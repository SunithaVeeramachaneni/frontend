import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSettingsContainerComponent } from './user-settings-container.component';

describe('UserSettingsContainerComponent', () => {
  let component: UserSettingsContainerComponent;
  let fixture: ComponentFixture<UserSettingsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSettingsContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
