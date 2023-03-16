import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionImageComponent } from './instruction-image.component';

describe('InstructionImageComponent', () => {
  let component: InstructionImageComponent;
  let fixture: ComponentFixture<InstructionImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructionImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
