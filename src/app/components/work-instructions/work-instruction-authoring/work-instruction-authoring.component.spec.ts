import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkInstructionAuthoringComponent } from './work-instruction-authoring.component';

describe('WorkInstructionAuthoringComponent', () => {
  let component: WorkInstructionAuthoringComponent;
  let fixture: ComponentFixture<WorkInstructionAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkInstructionAuthoringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkInstructionAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
