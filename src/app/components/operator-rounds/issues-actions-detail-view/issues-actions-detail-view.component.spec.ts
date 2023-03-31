import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesActionsDetailViewComponent } from './issues-actions-detail-view.component';

describe('IssuesActionsDetailViewComponent', () => {
  let component: IssuesActionsDetailViewComponent;
  let fixture: ComponentFixture<IssuesActionsDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssuesActionsDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesActionsDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
