import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShrSubmissionModalComponent } from './shr-submission-modal.component';

describe('ShrSubmissionModalComponent', () => {
  let component: ShrSubmissionModalComponent;
  let fixture: ComponentFixture<ShrSubmissionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShrSubmissionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShrSubmissionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
