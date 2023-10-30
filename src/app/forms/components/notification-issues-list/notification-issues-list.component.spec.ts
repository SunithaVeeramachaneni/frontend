import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationIssuesListComponent } from './notification-issues-list.component';

describe('NotificationIssuesListComponent', () => {
  let component: NotificationIssuesListComponent;
  let fixture: ComponentFixture<NotificationIssuesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationIssuesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationIssuesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
