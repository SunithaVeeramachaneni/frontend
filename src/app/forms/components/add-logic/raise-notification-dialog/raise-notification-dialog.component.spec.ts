import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseNotificationDialogComponent } from './raise-notification-dialog.component';

describe('RaiseNotificationDialogComponent', () => {
  let component: RaiseNotificationDialogComponent;
  let fixture: ComponentFixture<RaiseNotificationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaiseNotificationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseNotificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
