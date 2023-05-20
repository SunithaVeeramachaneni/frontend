import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesActionsViewComponent } from './issues-actions-view.component';

describe('IssuesActionsViewComponent', () => {
  let component: IssuesActionsViewComponent;
  let fixture: ComponentFixture<IssuesActionsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssuesActionsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesActionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
