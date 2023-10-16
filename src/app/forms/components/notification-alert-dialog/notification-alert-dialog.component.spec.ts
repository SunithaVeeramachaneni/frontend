import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationAlertDialogComponent } from './notification-alert-dialog.component';

describe('NotificationAlertDialogComponent', () => {
  let component: NotificationAlertDialogComponent;
  let fixture: ComponentFixture<NotificationAlertDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationAlertDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
