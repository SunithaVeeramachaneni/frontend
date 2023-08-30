import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkInstructionHeaderModalComponent } from './work-instruction-header-modal.component';

describe('WorkInstructionHeaderModalComponent', () => {
  let component: WorkInstructionHeaderModalComponent;
  let fixture: ComponentFixture<WorkInstructionHeaderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkInstructionHeaderModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkInstructionHeaderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
