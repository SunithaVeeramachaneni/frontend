import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiMicModalComponent } from './ai-mic-modal.component';

describe('AiMicModalComponent', () => {
  let component: AiMicModalComponent;
  let fixture: ComponentFixture<AiMicModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiMicModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiMicModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
