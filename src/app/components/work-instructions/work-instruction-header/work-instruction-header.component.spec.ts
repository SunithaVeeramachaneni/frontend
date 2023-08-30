import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkInstructionHeaderComponent } from './work-instruction-header.component';

describe('WorkInstructionHeaderComponent', () => {
  let component: WorkInstructionHeaderComponent;
  let fixture: ComponentFixture<WorkInstructionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkInstructionHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkInstructionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
