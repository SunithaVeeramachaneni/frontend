import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionResponseComponent } from './instruction-response.component';

describe('InstructionResponseComponent', () => {
  let component: InstructionResponseComponent;
  let fixture: ComponentFixture<InstructionResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructionResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
